# ADR-002: Relational Data Persistence with PostgreSQL and Drizzle ORM

| Metadata | Details |
| :--- | :--- |
| **Status** | Accepted |
| **Date** | 2026-11-03 |
| **Author** | Trương Hiển Long (24127445) |
| **Deciders** | Trương Hiển Long (24127445) |
| **Supercedes** | None |

---

## Context
Vible models structured educational domain entities—Users, Roles, Courses, Enrollments, Assignments, Submissions, Grades, and Announcements—with strict relational integrity constraints (e.g., BR-01: one role per user, BR-02: course belongs to one teacher, BR-03: unique enrollment per student per course, BR-07: assignment due dates and submission timestamps). 

Furthermore, our deployment target is Cloudflare Pages / Workers (V8 Isolates). Traditional heavy Node.js ORMs that rely on native binaries or huge runtime query engines encounter compatibility and latency issues at the Edge. We require a database solution and an Object-Relational Mapping (ORM) layer that guarantees ACID compliance, zero data loss (NFR-03, NFR-06), supports SQL normalization up to 3NF/BCNF, and runs seamlessly on serverless Edge runtimes with near-zero cold starts.

## Decision
We decided to select **PostgreSQL 16** hosted on **Neon** combined with **Drizzle ORM** as our data access layer.

For the database driver, we adopt **`@neondatabase/serverless`** configured with `drizzle-orm/neon-http`. Queries are executed over stateless HTTP (`fetch`) directly against Neon's serverless HTTP proxy, with WebSocket pooling (`@neondatabase/serverless` `Pool`) available for interactive multi-statement transactions when required. This eliminates TCP connection overhead, does not require TCP-level connection poolers like PgBouncer or Cloudflare Hyperdrive in our serverless runtime, and prevents connection pool exhaustion at the Edge.

## Alternatives Considered
1. **Prisma ORM with PostgreSQL**:
   - *Pros*: Declarative `schema.prisma`, automatic migrations, built-in Prisma Studio GUI.
   - *Cons*: On Cloudflare Workers V8 Isolates, Prisma requires compiling an underlying Rust-based query engine to WebAssembly (`@prisma/client/runtime/wasm.js` ~1.8–2.0 MB WASM binary) combined with driver adapters (`@prisma/adapter-neon`). Instantiating and compiling the WASM module incurs a measurable 50–150 ms cold-start penalty per isolate initialization. Furthermore, Prisma's internal engine abstracts query execution behind an intermediary translation layer, adding serialization overhead and obscuring generated SQL compared to Drizzle's lightweight (~40 KB gzipped), zero-dependency pure TypeScript query builder.
2. **MongoDB / Mongoose (NoSQL)**:
   - *Pros*: Flexible document schema, easy initial setup.
   - *Cons*: Weak relational constraint enforcement across multiple collections (e.g., enrollment rosters, unique compound keys for assignment submissions). Lacks native ANSI-SQL compliance needed for database design evaluation (3NF normalization, foreign key cascading).
3. **Cloudflare D1 (SQLite at the Edge)**:
   - *Pros*: Native Edge integration and direct binding (`env.DB`) within the Cloudflare ecosystem.
   - *Cons*: Cloudflare D1 is based on SQLite, which enforces database-level single-writer serialization. Concurrent write operations (e.g., simultaneous assignment submissions or grading spikes) cause write contention and queue timeouts (`SQLITE_BUSY`). Additionally, D1 lacks native PostgreSQL data types (native UUIDs, `ENUM`s, rich timezone-aware timestamp arithmetic) and couples the project to Cloudflare's proprietary D1 dialect rather than standard ANSI PostgreSQL with Multi-Version Concurrency Control (MVCC) and row-level locking.
4. **`postgres.js` (TCP Driver)**:
   - *Pros*: High-performance pure-JS PostgreSQL client supporting connection pipelining.
   - *Cons*: `postgres.js` communicates strictly over TCP sockets (PostgreSQL wire protocol), not WebSockets or HTTP. Because Cloudflare Workers isolates are ephemeral and cannot maintain persistent client-side TCP connection pools across invocations, running `postgres.js` on Workers requires routing through **Cloudflare Hyperdrive** to manage connection pooling and avoid connection exhaustion. In contrast, `@neondatabase/serverless` provides native HTTP/fetch querying without additional infrastructure configuration.

## Consequences
### Positive
- **Optimal Edge Performance**: Drizzle ORM is a lightweight TypeScript-first query builder with zero runtime dependencies and near-zero cold-start latency.
- **SQL Transparency & Type Safety**: Drizzle schemas map directly to SQL DDL, providing compile-time TypeScript type checking for all queries, mutations, and joins.
- **Relational Integrity**: PostgreSQL enforces foreign keys, cascading deletes/updates, composite unique constraints (`UNIQUE(course_id, student_id)`), and checks at the database engine level.
- **Serverless Connection Management**: The `@neondatabase/serverless` HTTP driver routes queries via stateless HTTP requests to Neon's proxy. Unlike traditional TCP drivers that rely on PgBouncer or Cloudflare Hyperdrive to prevent connection exhaustion, HTTP-based queries do not hold open persistent database connections on the Workers side.

### Negative / Trade-offs
- **Explicit Migrations**: Unlike Prisma's declarative migration magic, Drizzle requires explicit generation of migration SQL files via `drizzle-kit generate` and execution via `drizzle-kit migrate`.
- **Learning Curve**: Requires team members to write SQL-like queries (`db.select().from(...).where(...)`) rather than abstract object navigation methods.
