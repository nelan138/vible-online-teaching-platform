# ADR-003: Stateless Session and Role-Based Access Control Using JWT Stored in HttpOnly Secure Cookies

| Metadata | Details |
| :--- | :--- |
| **Status** | Accepted |
| **Date** | 2026-11-04 |
| **Author** | Trương Hiển Long (24127445) |
| **Deciders** | Trương Hiển Long (24127445) |
| **Supercedes** | None |

---

## Context
Vible enforces strict role-based access control (RBAC) where users are classified strictly as either a **Teacher** or a **Student** (BR-01, FR-01C, NFR-02). Teachers have exclusive authority to create and modify courses, publish materials, create assignments, manage rosters, and assign grades (BR-02, BR-08). Students can only view enrolled course content, submit assignments, and participate in discussions (BR-04).

Furthermore, according to NFR-07 (Security - Transport & Credentials), credentials and session tokens must never be exposed to Cross-Site Scripting (XSS) or transmitted in plaintext. The system operates on a distributed serverless edge runtime without shared server-side session memory (e.g., standard in-memory Express session store).

## Decision
We decided to adopt **stateless JSON Web Tokens (JWT)** for session management and authorization, signed using an asymmetric/HMAC secret key (`HS256` / `RS256`).

The issued JWT payload contains the authenticated user's ID, email, and explicit role (`teacher` or `student`). To guard against XSS vulnerabilities:
1. The JWT token is transmitted to the client and stored exclusively inside an **HttpOnly, Secure, SameSite=Strict cookie** named `vible_session`.
2. The browser automatically attaches this cookie to same-origin API requests, preventing JavaScript client scripts (e.g., third-party packages) from accessing or stealing the token.
3. Server-side Nitro middleware (`server/middleware/auth.ts`) intercepts every incoming request, validates the JWT signature and expiration, extracts user context into `event.context.user`, and verifies role permissions before executing protected route handlers.

## Alternatives Considered
1. **Server-Side Stateful Sessions with Redis**:
   - *Pros*: Instant revocation capability upon user logout or ban.
   - *Cons*: Introduces another external managed database service (Redis cluster), increasing operational complexity and potential connection latency from global Edge workers.
2. **JWT Stored in Browser `localStorage` / `sessionStorage`**:
   - *Pros*: Trivial to implement; frontend explicitly sets `Authorization: Bearer <token>` headers.
   - *Cons*: Severely vulnerable to XSS attacks. Any malicious script or dependency vulnerability could exfiltrate the stored JWT, directly violating NFR-07 security guidelines.
3. **Third-Party Managed Auth (Clerk, Auth0, Firebase Auth)**:
   - *Pros*: Turn-key authentication, social logins.
   - *Cons*: Third-party free tiers impose user caps, vendor lock-in, and make grading and automated end-to-end integration testing in local environments significantly more complex.

## Consequences
### Positive
- **Stateless & Edge-Ready**: Edge workers can verify cryptographic signatures locally without performing a database roundtrip on every authenticated request.
- **XSS & CSRF Resilience**: `HttpOnly` protects the token from XSS read attacks; `SameSite=Strict` combined with custom anti-CSRF headers protects against Cross-Site Request Forgery.
- **Role Validation**: Role is encoded directly within the cryptographically signed JWT claim, allowing instantaneous role verification in API guards.

### Negative / Trade-offs
- **Token Invalidation Delay**: Standard stateless JWTs cannot be revoked immediately before their expiration time without maintaining a distributed token blacklist or keeping token lifetimes relatively short (e.g., 1 hour) paired with sliding refresh cycles.
