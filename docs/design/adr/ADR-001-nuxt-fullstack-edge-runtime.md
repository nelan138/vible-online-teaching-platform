# ADR-001: Adoption of Nuxt 4 Full-Stack Framework with Nitro Engine on Cloudflare Pages

| Metadata | Details |
| :--- | :--- |
| **Status** | Accepted |
| **Date** | 2026-11-02 |
| **Author** | Trương Hiển Long (24127445) |
| **Deciders** | Trương Hiển Long (24127445) |
| **Supercedes** | None |

---

## Context
Vible is an online teaching platform requiring a lightweight, highly responsive user interface for teachers and students, coupled with a fast, reliable backend API to handle course rosters, material distributions, and assignment submissions. According to our non-functional requirements (NFR-01), user interactions and API endpoints must respond in under 500 ms globally, and the system must operate within a $0 infrastructure budget (free-tier constraint) while minimizing cold starts and deployment friction.

In earlier evaluations, separate frontend (e.g., standalone React/Vue SPA) and backend (e.g., Express.js / NestJS container on Render/Railway) architectures were considered. However, traditional container hosting on free tiers suffers from 30–50 second spin-down delays, violating NFR-01 and creating unacceptable user experiences during demonstration and grading.

## Decision
We decided to adopt **Nuxt 4** as our unified full-stack web framework, utilizing its server engine (**Nitro**) configured with the `cloudflare-pages` deployment preset. 

The application is deployed to **Cloudflare Pages / Workers**, running on global V8 Isolates at the edge. The frontend uses Vue 3 Single-File Components (SFCs), Nuxt UI, and Tailwind CSS, while server routes (`server/api/*`) handle RESTful API endpoints with full end-to-end TypeScript type inference.

## Alternatives Considered
1. **Separate Vue 3 SPA + Node.js/Express on Render Free Tier**:
   - *Pros*: Familiar traditional MVC pattern, independent scaling.
   - *Cons*: Render's free tier spins down after 15 minutes of inactivity, causing 30–50s cold-start delays. Maintaining two separate repositories and CI/CD pipelines increases team overhead.
2. **Next.js (React) on Vercel**:
   - *Pros*: Extensive community, React Server Components.
   - *Cons*: Vercel Hobby tier imposes a hard limit of 100 GB/month bandwidth (deployments are paused when exceeded under Vercel's Fair Use Policy) and caps serverless functions at 1,000,000 invocations/month, whereas Cloudflare Pages offers unlimited static egress bandwidth and 100,000 Worker requests/day (~3,000,000/month, a 3x higher execution ceiling). Furthermore, Vercel Hobby terms strictly restrict deployments to non-commercial personal projects. The team also possesses established expertise and velocity with Vue 3 SFCs and Nuxt UI.
3. **SvelteKit on Cloudflare Pages**:
   - *Pros*: Lightweight runtime, fast reactivity.
   - *Cons*: Smaller UI component ecosystem compared to Nuxt UI / Tailwind CSS, requiring more custom component development within tight deadlines.

## Consequences
### Positive
- **No container cold start**: Cloudflare Workers V8 Isolates start in milliseconds, so the compute tier has none of the 30–50 s spin-down delay seen on Render. This applies to the Worker only. The Neon database (ADR-002) suspends on the free tier when idle, so the first request after a quiet period can still wait for it to resume (see Negative / Trade-offs).
- **Unified TypeScript Codebase**: Shared DTO types, validation schemas (Zod/Valibot), and utilities between client and server without code duplication.
- **Built-in Nuxt Modules**: Out-of-the-box support for Tailwind CSS, Nuxt UI, Pinia state management, and `@nuxt/test-utils` with Vitest.
- **Zero Hosting Costs**: Cloudflare Pages offers unlimited static bandwidth and 100,000 free Worker requests per day, well exceeding project requirements.

### Negative / Trade-offs
- **Edge Runtime Constraints**: Cloudflare Workers run on V8 Isolates rather than full Node.js runtimes. Native C++ Node.js modules (such as `bcrypt` native binary or traditional filesystem access `fs`) cannot be used directly; edge-compatible alternatives (such as Web Crypto API or `bcryptjs` / `@node-rs/argon2` WASM) must be used.
- **10 ms CPU limit is a known risk**: Free-plan Workers allow 10 ms of CPU time per request (time spent waiting on I/O is not counted). Three workloads are likely to exceed it, and none has been benchmarked yet:
  - **Password hashing** at NFR-07 strength (Argon2id in WASM, or `bcryptjs` at cost ≥ 12) is expected to take far more than 10 ms (see ADR-003). Login and register could fail with Cloudflare error 1102 (CPU limit exceeded).
  - **Server-side rendering** of non-trivial Nuxt pages (large rosters, gradebooks) may also exceed it.
  - **File upload validation** (see ADR-004).
- **Database wake-up latency**: after an idle period, the first request waits for Neon to resume. This is the same kind of delay that this ADR cites against Render, although it is much shorter. Its effect on NFR-01 (< 500 ms) has not been measured.
- **NFR-01 is not yet demonstrated**: the < 500 ms target is a design goal. No latency measurement from multiple regions exists yet.

## Validation Plan and Mitigations
Before this decision is treated as settled, the following will be measured on a deployed Free-plan Worker during implementation:

1. CPU time of a login/register request using the chosen hashing algorithm and cost.
2. CPU time of server-rendering the heaviest pages (course roster, gradebook).
3. Latency of the first request after Neon has been idle (cold database) compared with a warm request.
4. p95 response time of key endpoints from at least two distant regions, compared with NFR-01.

If a measurement fails, the fallbacks, in order of preference, are:

- Render heavy authenticated pages client-side only (`ssr: false` route rules) and prerender the public pages.
- Lower the password-hashing cost to the lowest value that still satisfies NFR-07, or use the Web Crypto PBKDF2 implementation (native code; its CPU time must also be measured).
- Move to the Workers Paid plan (30 s CPU limit by default), which keeps the architecture unchanged.
- Add a lightweight keep-alive request, or use Neon's autosuspend settings, to avoid cold-database delays during demonstrations.
