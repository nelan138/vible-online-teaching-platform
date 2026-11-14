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
We decided to select **PostgreSQL 16** hosted on a managed serverless cloud provider (such as **Neon** or **Supabase**) combined with **Drizzle ORM** as our data access layer.

Drizzle ORM is configured with serverless PostgreSQL drivers (`@neondatabase/serverless` or `postgres.js` with WebSocket connection pooling / PgBouncer) to ensure ultra-low connection latency from Cloudflare Workers over TLS.

## Alternatives Considered
1. **Prisma ORM with PostgreSQL**:
   - *Pros*: Declarative `schema.prisma`, automatic migrations, built-in Prisma Studio GUI.
   - *Cons*: Heavy Rust-based query engine binary (`prisma-engines`) or WASM driver adapter increases bundle size significantly (> 2-3 MB) and incurs noticeable cold-start overhead in Cloudflare V8 Isolates. High abstraction layer obscures generated SQL, complicating query indexing and normalisation verification.
2. **MongoDB / Mongoose (NoSQL)**:
   - *Pros*: Flexible document schema, easy initial setup.
   - *Cons*: Weak relational constraint enforcement across multiple collections (e.g., enrollment rosters, unique compound keys for assignment submissions). Lacks native ANSI-SQL compliance needed for database design evaluation (3NF normalization, foreign key cascading).
3. **Cloudflare D1 (SQLite at the Edge)**:
   - *Pros*: Native Edge integration within Cloudflare ecosystem.
   - *Cons*: SQLite lacks advanced concurrent write scaling, has limited support for rich PostgreSQL extensions and UUID data types, and imposes single-region write bottlenecks that do not match standard enterprise LMS persistence models.

## Consequences
### Positive
- **Optimal Edge Performance**: Drizzle ORM is a lightweight TypeScript-first query builder with zero runtime dependencies and near-zero cold-start latency.
- **SQL Transparency & Type Safety**: Drizzle schemas map directly to SQL DDL, providing compile-time TypeScript type checking for all queries, mutations, and joins.
- **Relational Integrity**: PostgreSQL enforces foreign keys, cascading deletes/updates, composite unique constraints (`UNIQUE(course_id, student_id)`), and checks at the database engine level.
- **Connection Pooling**: Serverless PostgreSQL drivers tunnel queries over HTTP/WebSockets via PgBouncer, preventing connection exhaustion from stateless serverless worker invocations.

### Negative / Trade-offs
- **Explicit Migrations**: Unlike Prisma's declarative migration magic, Drizzle requires explicit generation of migration SQL files via `drizzle-kit generate` and execution via `drizzle-kit migrate`.
- **Learning Curve**: Requires team members to write SQL-like queries (`db.select().from(...).where(...)`) rather than abstract object navigation methods.
