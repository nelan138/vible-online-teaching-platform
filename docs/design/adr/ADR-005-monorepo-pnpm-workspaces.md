# ADR-005: Monorepo Architecture Using pnpm Workspaces and Turborepo

| Metadata | Details |
| :--- | :--- |
| **Status** | Accepted |
| **Date** | 2026-11-13 |
| **Author** | Trương Hiển Long (24127445) |
| **Deciders** | Trương Hiển Long (24127445) |
| **Supercedes** | None |

---

## Context
Vible is an online teaching platform with multiple interdependent software subsystems:
1. **Frontend Presentation**: Vue 3 Single-Page Application (SPA) / Progressive Web App (PWA) with Nuxt UI and Tailwind CSS.
2. **Backend Serverless API**: Nitro Edge Server engine hosting REST endpoints, authentication middleware, and business services.
3. **Data Access & Relational Persistence**: Drizzle ORM schemas, migration scripts, seeding utilities, and PostgreSQL connection pooling.
4. **Shared Domain Logic & Contracts**: Cross-cutting TypeScript interfaces, Data Transfer Objects (DTOs), Zod/Valibot validation schemas, role definitions (`TEACHER`, `STUDENT`), and business rule constants (e.g., maximum upload limit of 20 MiB per BR-06).

Previously, the team considered maintaining either a single flat monolith or separate repositories (polyrepo). However:
- A flat monolith intermingles frontend UI components, database migration tooling, and server handlers, leading to tight coupling, namespace pollution, and accidental leakage of server-only secrets/drivers into client bundles.
- A polyrepo (separate repositories for web, shared types, and database) introduces severe synchronization friction, cumbersome local npm linking, multi-repo pull request management, and the risk of schema and type contract drift during rapid development cycles.

We require a repository architecture that enforces modular separation of concerns, guarantees end-to-end type safety with zero duplication, simplifies dependency management, and streamlines local development and automated CI/CD pipelines.

## Decision
We decided to adopt a **Monorepo Architecture** managed via **pnpm Workspaces** with **Turborepo** as the build orchestration and task caching engine.

### Monorepo Structure:
```
vible-online-teaching-platform/
├── apps/
│   └── web/                   # @vible/web: Nuxt 4 full-stack application (Vue 3 frontend + Nitro edge API)
├── packages/
│   ├── shared/                # @vible/shared: Shared domain types, DTOs, Zod validation schemas, business constants
│   ├── db/                    # @vible/db: Drizzle ORM schema, migration scripts, connection pooler, seed scripts
│   ├── ui/                    # @vible/ui: Shared UI design tokens and shared Vue component primitives (optional)
│   └── config/                # @vible/config: Shared ESLint, Prettier, and TypeScript base configurations
├── docs/                      # Architectural designs, ADRs, requirements, and meeting records
├── pa/                        # Course project assignment deliverables (PA1 - PA5)
├── package.json               # Root monorepo workspace configuration & orchestration scripts
├── pnpm-workspace.yaml        # pnpm workspace definition
└── turbo.json                 # Turborepo task pipeline and remote cache definition
```

### Key Technical Aspects:
1. **Package Workspace Protocol**: Internal packages are referenced via the `workspace:*` protocol (e.g., `"@vible/shared": "workspace:*"` and `"@vible/db": "workspace:*"` inside `apps/web/package.json`).
2. **Single Source of Truth for Contracts**: Validation schemas (Zod) defined in `@vible/shared` are executed on the client for instant form validation and reused on Nitro server endpoints for strict request body parsing, completely eliminating schema mismatch bugs.
3. **Isolated Database Management**: Database schema migrations (`drizzle-kit generate`, `drizzle-kit migrate`) and database seeds run within `@vible/db`, completely decoupled from Nuxt runtime bundling.
4. **Fast Incremental Builds with Turborepo**: Tasks (`build`, `lint`, `test`, `typecheck`) are declared in `turbo.json` with topological dependency graphs and content-hashed caching, speeding up GitHub Actions CI runs.

## Alternatives Considered
1. **Polyrepo (Separate Git Repositories)**:
   - *Pros*: Completely isolated version control and access permissions.
   - *Cons*: High overhead for a 4-person team; changes to a database schema or DTO require publishing a private npm package or complex Git submodules, slowing down feature delivery and risking contract drift.
2. **Single-Folder Flat Monolith**:
   - *Pros*: Zero setup overhead.
   - *Cons*: Poor separation of concerns; server-side Drizzle dependencies risk getting bundled into client-side Vue builds; migration scripts and seeds clutter application root; lacks reusability if secondary apps (e.g., admin CLI or mobile app) are introduced.
3. **Nx Monorepo**:
   - *Pros*: Rich enterprise plugin ecosystem and code generation generators.
   - *Cons*: Significantly higher configuration complexity and steeper learning curve compared to lightweight pnpm workspaces + Turborepo.
4. **npm Workspaces / Yarn Berry (Alternative Package Managers)**:
   - *Pros*: `npm` comes pre-installed with Node.js; `yarn` has an established community.
   - *Cons*:
     - `npm workspaces` relies on flat `node_modules` hoisting, creating **phantom dependencies** (where packages can secretly import undeclared transitive dependencies), leading to deployment failures. It also has noticeably slower installation times in CI.
     - `yarn` Plug'n'Play (PnP) creates compatibility friction with Vite and Nuxt runtime module resolvers.
     - *Why pnpm was chosen*: Strict, non-flat symlinked `node_modules` eliminates phantom dependencies; global content-addressable cache speeds up CI builds by 2–3x; and native support for `workspace:*` protocols.

## Consequences
### Positive
- **Guaranteed Type Safety**: Changes in database schemas or DTOs immediately reflect across the entire application at compile time.
- **Efficient Disk Space & Installation Speed**: `pnpm` uses a global content-addressable store and hard links, resulting in lightning-fast package installations and minimal disk usage compared to `npm` or `yarn`.
- **Modular Boundaries**: Clear separation between UI presentation (`apps/web`), data persistence (`packages/db`), and shared domain rules (`packages/shared`).
- **Unified CI/CD**: Single GitHub Actions workflow runs linting, testing, and builds across all packages with intelligent caching via Turborepo (`turbo run test --filter=...`).

### Negative / Trade-offs
- **Tooling Familiarity**: Team members must understand workspace concepts (`pnpm --filter <package> <command>`) and avoid creating circular package dependencies.
- **Deployment Configuration**: Cloudflare Pages build command must be configured with the monorepo root context (e.g., `pnpm --filter @vible/web run build` with build output directory `apps/web/dist`). Under the `cloudflare-pages` Nitro preset, the deployable output containing both `_worker.js` and static assets is written to `dist/`, rather than the standard `.output/public`.
