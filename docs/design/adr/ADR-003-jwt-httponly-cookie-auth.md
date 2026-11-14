# ADR-003: Stateless HS256 JWT Sessions in SameSite=Lax HttpOnly Cookies with Rotating Refresh Tokens

| Metadata | Details |
| :--- | :--- |
| **Status** | Accepted (Revised) |
| **Date** | 2026-11-04 (Revised 2026-11-14) |
| **Author** | Trương Hiển Long (24127445) |
| **Deciders** | Trương Hiển Long (24127445) |
| **Supersedes** | None. This ADR is revised in place rather than superseded, because the 2026-11-04 version was never implemented; see [Revision History](#revision-history). |

---

## Context
Vible enforces role-based access control (RBAC): every user is either a **Teacher** or a **Student** (BR-01, FR-01C, NFR-02). Teachers alone create and modify courses, publish materials, create assignments, manage rosters, and assign grades (BR-02, BR-08). Students view the content of courses they are enrolled in, submit assignments, and take part in discussions (BR-04, BR-05). A user's role is chosen at registration and never changes afterwards: the system has no administrator role and no feature that changes a role, bans an account, or resets a password.

The forces that shape this decision are:

1. **Credential security (NFR-07)**: session tokens must never be readable by client-side JavaScript (XSS) or sent in plaintext, and passwords must be hashed with Argon2id or bcrypt (cost ≥ 12).
2. **Stateless edge runtime (ADR-001)**: the application runs as one Nitro bundle on Cloudflare Pages / Workers (V8 isolates). There is no shared in-memory session store, and each request on the Free plan is limited to **10 ms of CPU time**.
3. **Low latency (NFR-01)**: 95% of API requests must finish in under 500 ms, so authenticating a request should not require a database round trip on every read.
4. **Deep links**: students and teachers reach Vible from links in emails, LMS announcements (Canvas, Moodle), chat platforms, and syllabus PDFs. A logged-in user who follows such a link must not be sent to the login screen.
5. **Token theft**: a stolen long-lived credential must be detectable and revocable, even though access tokens themselves are verified without state.
6. **Data minimization**: tokens should carry only what authorization needs, because cookies end up in proxy dumps, error traces, and request logs.

---

## Decision
We use **HS256-signed JWT access tokens**, created and checked with the native **Web Crypto API**, sent in **`SameSite=Lax`, `HttpOnly`, `Secure` cookies**. They are protected by an explicit **anti-CSRF middleware**, paired with **opaque rotating refresh tokens** stored in PostgreSQL with reuse detection, and limited to a **minimal claims payload**.

---

### 1. Signing Algorithm: HS256 via Web Crypto API
**`HS256` (HMAC-SHA256)** is the only signing algorithm Vible accepts.

- **Symmetric MAC**: HS256 is a symmetric message authentication code. Issuing tokens (`/api/auth/login`, `/api/auth/refresh`) and verifying them (`server/middleware/auth.ts`) use the same secret, `JWT_SECRET`.
- **One service, one secret**: Vible is a single Nitro deployment (ADR-001). No other service has to verify Vible tokens, so the main benefit of an asymmetric algorithm (verifying with a public key without holding the signing key) does not apply here. One shared secret is also simpler to manage than a key pair.
- **Secret requirements**: `JWT_SECRET` is **32 random bytes** from a CSPRNG (for example `openssl rand -base64 32`), stored as a Cloudflare Pages encrypted environment variable and read through `useRuntimeConfig()`. It must never be a human-chosen string.
- **No Node-only dependencies**: `crypto.subtle` is available in Cloudflare Workers, Node.js 20+, and browsers. Node-specific libraries such as `jsonwebtoken`, which depend on Node's `crypto` module, are not used.
- **CPU cost**: an HMAC-SHA256 over a token of about 200 bytes runs natively in the runtime and costs a small fraction of a millisecond. The exact figure will be measured on the deployed Worker during implementation.

#### Verification Rules
The verifier is the security-critical half and must:

1. Split the token into exactly three base64url segments; anything else is rejected.
2. Decode the header and **reject any `alg` other than `HS256`** (this blocks `none` and algorithm-confusion attacks). The algorithm is fixed by the server and never taken from the token.
3. Check the signature with `crypto.subtle.verify` (constant-time), never by comparing signature strings.
4. Reject tokens whose `exp` has passed or whose `iat` is in the future, allowing **30 seconds of clock skew**, and reject any `iss` other than `'vible'`.
5. Import the `CryptoKey` once per isolate and reuse it, instead of calling `importKey` on every request.

```typescript
// server/utils/jwt.ts — edge-compatible HS256 via Web Crypto API
const enc = new TextEncoder();
let cachedKey: Promise<CryptoKey> | undefined;

function getKey(secret: string): Promise<CryptoKey> {
  cachedKey ??= crypto.subtle.importKey(
    'raw',
    base64ToBytes(secret),                // 32 random bytes, base64-encoded
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
  return cachedKey;
}

export async function signHS256(payload: SessionTokenPayload, secret: string): Promise<string> {
  const header = base64UrlEncode(enc.encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' })));
  const body = base64UrlEncode(enc.encode(JSON.stringify(payload)));
  const sig = await crypto.subtle.sign('HMAC', await getKey(secret), enc.encode(`${header}.${body}`));
  return `${header}.${body}.${base64UrlEncode(new Uint8Array(sig))}`;
}

export async function verifyHS256(token: string, secret: string): Promise<SessionTokenPayload | null> {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [header, body, sig] = parts;

  const { alg } = JSON.parse(new TextDecoder().decode(base64UrlDecode(header)));
  if (alg !== 'HS256') return null;

  const valid = await crypto.subtle.verify(
    'HMAC', await getKey(secret), base64UrlDecode(sig), enc.encode(`${header}.${body}`),
  );
  if (!valid) return null;

  const claims = JSON.parse(new TextDecoder().decode(base64UrlDecode(body))) as SessionTokenPayload;
  const now = Math.floor(Date.now() / 1000);
  const SKEW = 30;
  if (claims.iss !== 'vible' || claims.exp + SKEW < now || claims.iat - SKEW > now) return null;
  return claims;
}
```

`base64UrlEncode`, `base64UrlDecode`, and `base64ToBytes` are small helpers over `Uint8Array` in `server/utils/encoding.ts`. A malformed header or payload makes `JSON.parse` throw, and the auth middleware treats that the same as an invalid token (401).

#### Secret Rotation
If `JWT_SECRET` has to be replaced, the new secret is deployed as `JWT_SECRET` and the old one is kept as `JWT_SECRET_PREVIOUS` for 15 minutes (one access-token lifetime). During that window the verifier accepts either secret and the signer uses only the new one; afterwards `JWT_SECRET_PREVIOUS` is removed. Refresh tokens are not signed with the secret (§4), so rotation does not log anyone out.

---

### 2. Cookie Transport Policy: `SameSite=Lax`
Tokens are stored only in HTTP cookies:

| Cookie Name | Path | Lifetime | HttpOnly | Secure | SameSite | Contents |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `vible_session` | `/` | 15 minutes (`Max-Age=900`) | `true` | `true` | `Lax` | HS256 access token (§5). |
| `vible_refresh` | `/api/auth` | 7 days (`Max-Age=604800`) | `true` | `true` | `Lax` | Opaque random refresh token (§4). |

The refresh cookie is scoped to `/api/auth`, so the browser sends it only to `/api/auth/refresh` and `/api/auth/logout`, never to ordinary API or page requests.

#### Why `Lax` instead of `Strict`
- **Problem with `Strict`**: the browser withholds `Strict` cookies on every cross-site request, *including top-level `GET` navigations*. A student who clicks `https://vible.edu/courses/csc13002/assignments/hw1` in an email arrives without a session cookie and looks logged out.
- **What `Lax` allows and blocks**:
  1. **Allowed**: the cookie is sent on top-level `GET` navigations from other sites, so deep links arrive authenticated.
  2. **Blocked**: the cookie is withheld on cross-site requests with unsafe methods (`POST`, `PUT`, `PATCH`, `DELETE`) and on cross-site subresource requests (`<img>`, `<iframe>`, `<script>`, `fetch`).
  3. **Required discipline**: every `GET` route is safe and has no side effects (RFC 9110 §9.2.1). No state change (enrollment, submission, grading) is ever exposed over `GET`.
- **Limit of `Lax`**: `SameSite` works per *site* (registrable domain), not per origin, so a request from a sibling subdomain counts as same-site. The `Origin` check in §3 is what covers that case.

#### Deep Links After the Access Token Expires
When a user follows a link after more than 15 idle minutes, the browser has already dropped `vible_session`, and `vible_refresh` is not sent with page navigations because of its path. To keep deep links working in this case:

1. The page-level route middleware (`app/middleware/auth.global.ts`) **never redirects to `/login` just because the session cookie is missing**. It first calls `POST /api/auth/refresh` once.
2. Only if that refresh fails does it redirect to `/login?redirect=<original path>`.
3. After a successful login, the login page returns the user to `redirect`. It accepts only a relative path that starts with a single `/` (not `//`), so the parameter cannot be used as an open redirect.

---

### 3. Anti-CSRF Middleware
`SameSite=Lax` is the first defence. Nitro middleware (`server/middleware/csrf.ts`) adds explicit checks on every request with an unsafe method, including the login and register endpoints:

```
                 Incoming request
                        │
        [1. Method is GET / HEAD / OPTIONS?] ── Yes ──► next handler
                        │ No
                        ▼
        [2. X-Requested-With: XMLHttpRequest?] ── No ──► 403
                        │ Yes
                        ▼
        [3. Sec-Fetch-Site present and not 'same-origin'?] ── Yes ──► 403
                        │ No
                        ▼
        [4. Origin header present?]
             ├── Yes: Origin === APP_ORIGIN? ── No ──► 403
             └── No:  Referer origin === APP_ORIGIN? ── No / missing ──► 403
                        │ Yes
                        ▼
                 Route handler
```

1. **Custom header (`X-Requested-With: XMLHttpRequest`)**:
   - The Vible client adds this header to every unsafe request through a global `$fetch` option. It is the only accepted value (`CSRF_HEADER_NAME` / `CSRF_HEADER_VALUE` in `@vible/shared`).
   - HTML forms, `<img>`, and `<iframe>` cannot set custom headers.
   - Cross-origin JavaScript that sets a custom header triggers a CORS preflight. **Vible never sends CORS headers (`Access-Control-Allow-*`) on any `/api/*` route**, so the browser fails the preflight and the real request is never sent. This rule is part of the decision: adding CORS headers later would weaken this check and needs a new ADR.
2. **`Sec-Fetch-Site`**: browsers that support Fetch Metadata send this header. Any value other than `same-origin` (`same-site`, `cross-site`, `none`) is rejected, which also covers sibling subdomains.
3. **`Origin`, with `Referer` as fallback**: the request's `Origin` must equal `APP_ORIGIN` exactly (`https://vible.edu` in production, `http://localhost:3000` in development). If `Origin` is missing, the origin of the `Referer` URL must match instead. If both are missing, the request is rejected. Browsers send `Origin` on every unsafe `fetch`, so this does not affect legitimate users.

```typescript
// server/middleware/csrf.ts
import { CSRF_HEADER_NAME, CSRF_HEADER_VALUE } from '@vible/shared';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

export default defineEventHandler((event) => {
  if (SAFE_METHODS.has(event.method)) return;

  const reject = (reason: string) => {
    throw createError({ statusCode: 403, statusMessage: `CSRF check failed: ${reason}` });
  };

  // 1. Custom header
  if (getHeader(event, CSRF_HEADER_NAME) !== CSRF_HEADER_VALUE) reject('missing custom header');

  // 2. Fetch Metadata (only when the browser sends it)
  const fetchSite = getHeader(event, 'sec-fetch-site');
  if (fetchSite && fetchSite !== 'same-origin') reject('sec-fetch-site');

  // 3. Origin, falling back to Referer; one of them is required
  const appOrigin = useRuntimeConfig(event).public.appOrigin; // e.g. 'https://vible.edu'
  const origin = getHeader(event, 'origin');
  if (origin) {
    if (origin !== appOrigin) reject('origin');
  } else {
    const referer = getHeader(event, 'referer');
    let refererOrigin: string | undefined;
    try {
      refererOrigin = referer ? new URL(referer).origin : undefined;
    } catch {
      refererOrigin = undefined;
    }
    if (refererOrigin !== appOrigin) reject('referer');
  }
});
```

---

### 4. Token Lifecycle: Access Token, Rotating Refresh Token, and Reuse Detection

```
  +──────────────────────────+                 +──────────────────────────────+
  |  Access token (15 min)   |                 |  Refresh token (7 days)      |
  |  Cookie: vible_session   |                 |  Cookie: vible_refresh       |
  |  HS256 JWT:              |                 |  Opaque: 32 random bytes     |
  |  { sub, role, v,         |                 |  DB stores SHA-256 hash only |
  |    iat, exp, iss }       |                 |  Path: /api/auth             |
  +────────────┬─────────────+                 +──────────────┬───────────────+
               │                                              │
   Verified in edge middleware;                  Used only after a 401;
   no DB lookup on reads.                        rotated on every use.
   `v` checked inside the                                     │
   authorization query of                                     │
   every mutation.                                            │
               ▼                                              ▼
  +──────────────────────────────────────────────────────────────────────────+
  |  PostgreSQL                                                              |
  |  users.token_version (INTEGER, DEFAULT 1)                                |
  |  refresh_tokens (id, user_id, token_hash, expires_at, revoked_at, ...)   |
  +──────────────────────────────────────────────────────────────────────────+
                     ▲
                     │ Reuse of a rotated refresh token detected:
                     │ revoke all of the user's refresh tokens
                     │ and increment users.token_version
```

#### A. Storage
These tables are already defined in `packages/db/src/schema/index.ts` (Sections 5.2.1 and 5.2.10):
- `users.token_version`: `INTEGER NOT NULL DEFAULT 1`.
- `refresh_tokens`: `id (UUID PK)`, `user_id (FK → users.id ON DELETE CASCADE)`, `token_hash (UNIQUE)`, `expires_at`, `revoked_at`, `created_at`.

The refresh token is **32 random bytes** from `crypto.getRandomValues`, sent to the client base64url-encoded. Only its SHA-256 hash is stored, so a leaked database dump cannot be used to log in. Because the token has 256 bits of entropy, a plain (unsalted) SHA-256 is enough.

#### B. Access Token (15 Minutes)
- Lifetime: `exp = iat + 900`.
- **Read requests** (`GET`) are authorized from the token alone: signature, expiry, `role`. No database lookup.
- **Mutating requests** already run an authorization query that checks ownership or enrollment (BR-02, BR-04, BR-05). That same query also checks `users.token_version = :v`. If it returns no row, the request fails with `401`, so a revoked session cannot write even within its 15 minutes. Joining `users` on its primary key adds no extra round trip to the query that would run anyway:

  ```sql
  -- Example: teacher publishes material in a course they own
  SELECT c.id
  FROM courses c
  JOIN users u ON u.id = c.teacher_id
  WHERE c.id = :courseId
    AND u.id = :sub
    AND u.token_version = :v;
  ```

- Because roles never change (see Context), the `role` claim cannot go stale. Revocation matters only for stolen sessions.

#### C. Refresh (`POST /api/auth/refresh`)
1. Hash the presented `vible_refresh` value and **rotate it atomically**, so two concurrent requests cannot both succeed:
   ```sql
   UPDATE refresh_tokens
   SET revoked_at = NOW()
   WHERE token_hash = :hash AND revoked_at IS NULL AND expires_at > NOW()
   RETURNING user_id;
   ```
2. **One row returned**: load `role, token_version` for that `user_id`, insert a new `refresh_tokens` row, and set both new cookies (access token with `v = token_version`, new refresh token). The user ID comes from the refresh-token row, not from the expired access token.
3. **No row returned**: look the hash up without filters.
   - **Unknown hash or expired**: return `401` and clear both cookies.
   - **Revoked less than 30 seconds ago**: this is the normal race between two tabs that refreshed at the same moment (they share one cookie jar). Return `401` with code `REFRESH_RACE` and do *not* revoke anything. The client retries once; by then the browser holds the new refresh cookie set by the winning request.
   - **Revoked 30 seconds or more ago**: the token was rotated and is being reused, which signals theft. In one transaction, revoke every active refresh token for that user and increment `users.token_version`. Return `401` and clear both cookies. All sessions of that user, including the attacker's, must log in again, and any access token still within its 15 minutes can no longer mutate data (§4.B).

#### D. Logout (`POST /api/auth/logout`)
Revokes the presented refresh token (`revoked_at = NOW()`) and clears both cookies with `Max-Age=0`. The access token stays cryptographically valid until it expires (at most 15 minutes), but it is no longer in the browser.

#### E. Client Refresh Behaviour
- Refresh is **reactive**: the client does not refresh on a timer. A `401` from any `/api/*` route other than `/api/auth/*` triggers a refresh, whether the cookie was missing (dropped by the browser at `Max-Age`) or the token was expired.
- The `$fetch` interceptor keeps **one in-flight refresh promise per tab**, so parallel `401`s in the same tab cause a single refresh. After it succeeds, each failed request is retried once. If the refresh fails (or a `REFRESH_RACE` retry also fails), the user is sent to `/login?redirect=<current path>`.

---

### 5. Minimal Claims Payload

#### A. Access Token Payload
```typescript
// packages/shared/src/types/index.ts
export interface SessionTokenPayload {
  sub: string;            // User UUID (RFC 7519 subject)
  role: UserRole;         // 'TEACHER' | 'STUDENT' — fixed at registration (BR-01, NFR-02)
  v: number;              // users.token_version at issuance (§4.B)
  iat: number;            // Issued-at (epoch seconds)
  exp: number;            // iat + 900
  iss: string;            // 'vible'
}
```

The auth middleware maps the verified payload to `event.context.user = { id: sub, role, v }`.

#### B. Why `email` Is Not in the Token
| Concern | With `email` | Without `email` |
| :--- | :--- | :--- |
| **Data minimization** | The address is copied into every request cookie, and from there into proxy dumps, error traces, and request logs. | The token holds a pseudonymous UUID. That is still personal data under GDPR, but it does not identify the user without database access. |
| **Staleness** | If the user changes their email, the token disagrees with the database until it expires. | `sub`, and the `role` that never changes, cannot go stale. |
| **Need** | No guard reads `email`. | Guards read only `sub` and `role`. |

#### C. Profile Data
1. **On login**, `/api/auth/login` returns `UserProfileDTO { id, fullName, email, role, avatarUrl }` in the response body, and the Pinia user store keeps it in memory.
2. **On page reload**, the client calls `GET /api/auth/me`, which loads the user by `event.context.user.id` and returns current profile data.

---

### 6. Password Hashing and the CPU Limit
Login and registration hash passwords (NFR-07: Argon2id, or bcrypt with cost ≥ 12). This, not JWT signing, is the most CPU-intensive step in authentication. At the strength NFR-07 requires, Argon2id compiled to WASM, or `bcryptjs` at cost 12, is expected to need **far more than 10 ms of CPU** per hash.

- **Known risk**: on the Free plan, login and registration requests may exceed the 10 ms CPU limit. The cost will be measured on the deployed Worker during implementation (the same approach ADR-004 takes for upload CPU).
- **Fallback if the limit is exceeded**: move to the Workers Paid plan, which raises the per-request CPU limit. Lowering hashing cost below NFR-07 is **not** an acceptable fallback.
- Every other authenticated request pays only for one HMAC verification, which is well within the limit.

---

### 7. Sequence Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as Student / Teacher
    participant Client as Vue 3 Client
    participant Edge as Nitro Middleware (auth + csrf)
    participant AuthAPI as Auth Controller (/api/auth)
    participant DB as Neon PostgreSQL

    Note over User, DB: UC-02: Login and cookie issuance
    User ->> Client: Enter email and password
    Client ->> AuthAPI: POST /api/auth/login (X-Requested-With: XMLHttpRequest)
    AuthAPI ->> DB: SELECT id, password_hash, role, token_version FROM users WHERE email = ?
    DB -->> AuthAPI: User row
    AuthAPI ->> AuthAPI: Verify password hash (Argon2id)
    AuthAPI ->> AuthAPI: Sign HS256 access token {sub, role, v, iat, exp, iss}
    AuthAPI ->> DB: INSERT refresh_tokens (user_id, token_hash, expires_at)
    AuthAPI -->> Client: 200 OK + UserProfileDTO<br/>Set-Cookie: vible_session (15m, Path=/)<br/>Set-Cookie: vible_refresh (7d, Path=/api/auth)

    Note over User, DB: Authenticated read (no DB lookup for auth)
    Client ->> Edge: GET /api/courses (Cookie: vible_session)
    Edge ->> Edge: verifyHS256 and inject event.context.user
    Edge -->> Client: 200 OK (course data)

    Note over User, DB: Access token expired: reactive refresh with rotation
    Client ->> Edge: GET /api/courses (vible_session missing or expired)
    Edge -->> Client: 401 Unauthorized
    Client ->> AuthAPI: POST /api/auth/refresh (Cookie: vible_refresh)
    AuthAPI ->> DB: UPDATE refresh_tokens SET revoked_at = NOW() WHERE token_hash = ? AND active RETURNING user_id
    DB -->> AuthAPI: user_id
    AuthAPI ->> DB: SELECT role, token_version FROM users WHERE id = ?; INSERT new refresh_tokens row
    AuthAPI -->> Client: 200 OK<br/>Set-Cookie: vible_session (new)<br/>Set-Cookie: vible_refresh (new)
    Client ->> Edge: Retry GET /api/courses
    Edge -->> Client: 200 OK

    Note over User, DB: Stolen refresh token reused after rotation
    Client ->> AuthAPI: POST /api/auth/refresh (already-rotated token)
    AuthAPI ->> DB: UPDATE ... RETURNING user_id (no row)
    AuthAPI ->> DB: Lookup hash: revoked 30 s or more ago, so reuse
    AuthAPI ->> DB: BEGIN; revoke all refresh_tokens of user; token_version = token_version + 1; COMMIT
    AuthAPI -->> Client: 401 Unauthorized<br/>Set-Cookie: vible_session (Max-Age=0)<br/>Set-Cookie: vible_refresh (Max-Age=0)
    Client ->> User: Redirect to /login?redirect=<path>
```

---

## Alternatives Considered

### 1. Asymmetric Signatures (`RS256`, `EdDSA` / `Ed25519`)
- *Pros*: tokens can be verified with a public key, so other services could check them without holding the signing key. Ed25519 is fast and supported natively by Workers WebCrypto.
- *Cons*: **Rejected**.
  - Vible is one deployment (ADR-001), and no other service verifies its tokens, so public-key verification brings no benefit.
  - A key pair, its encoding, and its rotation are more to manage than one random secret.
  - RSA verification is fast, but RSA-2048 *signing* (done on every login and refresh) costs on the order of a millisecond or more, a noticeable share of the 10 ms limit. HS256 signing costs a small fraction of that.

### 2. `SameSite=Strict` Cookies
- *Pros*: the cookie is never sent on any cross-site request, including top-level navigations.
- *Cons*: **Rejected**. Every link from email, an LMS, chat, or a syllabus PDF would arrive logged out (§2). With `Lax`, the custom-header, `Sec-Fetch-Site`, and `Origin` checks give protection equivalent to `Strict` for our threat model (forged state-changing requests) without breaking deep links.

### 3. Bearer Token in `localStorage` / `sessionStorage`
- *Pros*: no cookie handling; the client simply sets `Authorization: Bearer <token>`.
- *Cons*: **Rejected**. Violates NFR-07: any XSS flaw or compromised npm dependency can read storage and steal the token.

### 4. Fully Stateful Sessions (Redis / Cloudflare KV)
- *Pros*: every request is checked against the store, so revocation is immediate for reads as well as writes.
- *Cons*: **Rejected**.
  - An external Redis (e.g. Upstash) adds a network round trip of tens of milliseconds to every request, including reads, which works against NFR-01.
  - Cloudflare KV is eventually consistent (changes can take up to about 60 seconds to propagate), and its free-tier write quota is low for per-request session updates.

### 5. Long-Lived Access Token Without a Refresh Token
- *Pros*: simplest implementation; no refresh endpoint or client interceptor.
- *Cons*: **Rejected**. A stolen token stays usable for its whole lifetime (days), and there is nothing to detect theft with. A short access token plus a rotating refresh token limits that window and makes reuse detectable (§4.C).

### 6. Profile Data (`email`, `fullName`) in JWT Claims
- *Pros*: the client could read profile fields without calling `/api/auth/me`.
- *Cons*: **Rejected**. HttpOnly cookies are unreadable by client code anyway. It would copy personal data into every request and its logs, and the claims would go stale when the profile changes (§5.B).

### 7. Third-Party Managed Auth (Clerk, Auth0, Firebase Auth)
- *Pros*: ready-made login UI and social login.
- *Cons*: **Rejected**. Pricing by monthly active users conflicts with the $0 budget, and depending on an external identity service makes local and CI end-to-end testing much harder.

---

## Consequences

### Positive
- **Reads need no database lookup for authentication**: one HMAC verification per request, which keeps read latency low (NFR-01).
- **Deep links work**: links from email, LMS, chat, and PDFs arrive logged in, including after the access token has expired (§2).
- **Layered CSRF protection**: `SameSite=Lax`, a required custom header, Fetch Metadata, and strict `Origin`/`Referer` matching together block forged state-changing requests.
- **Theft is detectable and revocable**: refresh tokens rotate on every use, reuse of a rotated token revokes every session of that user, and the `token_version` check stops writes from revoked sessions immediately.
- **Minimal claims**: cookies carry only a UUID, a role, and timing fields; no email or profile data.
- **No auth libraries**: signing, verification, and random-token generation use only Web Crypto, which runs the same in Workers, Node.js, and local development.

### Negative / Trade-offs & Mitigations
- **Revoked sessions can still read for up to 15 minutes**: a stolen access token whose session has been revoked keeps working for `GET` requests until it expires.
  - *Mitigation*: the window is bounded by the 15-minute lifetime, and every mutation re-checks `token_version` inside its authorization query (§4.B).
- **Database work on refresh**: each refresh runs one `UPDATE`, one `SELECT`, and one `INSERT`, roughly once every 15 minutes per active user.
  - *Mitigation*: all three use indexed columns (`idx_refresh_tokens_hash`, the `users` primary key) and are infrequent compared with normal requests.
- **Login may exceed the Free-plan CPU limit**: password hashing at NFR-07 strength is the main CPU risk (§6).
  - *Mitigation*: measure during implementation; fall back to the Workers Paid plan rather than weakening the hash.
- **Client complexity**: the client must refresh on `401`, share one refresh per tab, and retry once on `REFRESH_RACE`.
  - *Mitigation*: implemented once in the Nuxt `$fetch` (`ofetch`) interceptor (§4.E).
- **Discipline required**: the CSRF design relies on `GET` routes having no side effects and on the API never sending CORS headers. Both rules must be enforced in code review.

---

## Revision History

| Date | Change |
| :--- | :--- |
| 2026-11-04 | Initial version: stateless JWT in an HttpOnly `SameSite=Strict` cookie. |
| 2026-11-14 | Revised before implementation. Fixed the algorithm to HS256 (the first version listed "HS256 / RS256" and mislabeled HMAC as asymmetric). Switched to `SameSite=Lax` so deep links work. Specified the anti-CSRF checks that the first version mentioned but did not define. Added the rotating refresh token with reuse detection and the `token_version` check on mutations. Removed `email` from the token. Recorded password-hashing CPU cost as a known risk. |
