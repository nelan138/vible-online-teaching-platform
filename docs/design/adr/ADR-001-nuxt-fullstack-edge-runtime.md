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
   - *Pros*: Extensive community, server components.
   - *Cons*: Vercel Hobby tier has stricter bandwidth and function execution limits for collaborative student projects. The team has higher proficiency and speed with Vue/Nuxt SFCs.
3. **SvelteKit on Cloudflare Pages**:
   - *Pros*: Lightweight runtime, fast reactivity.
   - *Cons*: Smaller UI component ecosystem compared to Nuxt UI / Tailwind CSS, requiring more custom component development within tight deadlines.

## Consequences
### Positive
- **Instant Cold Starts**: Cloudflare Workers V8 Isolates start in ~0 ms, completely eliminating cold-start latency.
- **Unified TypeScript Codebase**: Shared DTO types, validation schemas (Zod/Valibot), and utilities between client and server without code duplication.
- **Built-in Nuxt Modules**: Out-of-the-box support for Tailwind CSS, Nuxt UI, Pinia state management, and `@nuxt/test-utils` with Vitest.
- **Zero Hosting Costs**: Cloudflare Pages offers unlimited static bandwidth and 100,000 free Worker requests per day, well exceeding project requirements.

### Negative / Trade-offs
- **Edge Runtime Constraints**: Cloudflare Workers run on V8 Isolates rather than full Node.js runtimes. Native C++ Node.js modules (such as `bcrypt` native binary or traditional filesystem access `fs`) cannot be used directly; edge-compatible alternatives (such as Web Crypto API or `bcryptjs` / `@node-rs/argon2` WASM) must be used.
- **Execution Limits**: Free Worker requests have a 10 ms CPU time limit per request, necessitating optimized, non-blocking asynchronous business logic.
