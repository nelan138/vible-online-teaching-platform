# ADR-004: Direct Cloudflare R2 Object Storage for Materials and Submissions

| Metadata | Details |
| :--- | :--- |
| **Status** | Accepted |
| **Date** | 2026-11-05 |
| **Author** | Trương Hiển Long (24127445) |
| **Deciders** | Trương Hiển Long (24127445) |
| **Supercedes** | None |

---

## Context
Vible allows instructors to upload course learning materials (PDFs, lecture slides, documents) and allows students to submit files for assignments (BR-05, BR-06, FR-04A, FR-05B). According to BR-06 and NFR-08, file uploads must be validated on the server, must not exceed 20 MiB, must not be empty, and must match allowed MIME types.

Relational databases (PostgreSQL) are ill-suited for storing large binary files (BLOBs), which cause database bloat, slow down backups, and degrade transactional query performance. Furthermore, routing entire 20 MiB file payloads directly through serverless Worker memory can cause memory exhaustion and breach Cloudflare free worker request/CPU limits.

## Decision
We decided to store all binary file assets in **Cloudflare R2 Object Storage** (an S3-compatible, globally distributed object storage service with zero egress fees).

The file management process utilizes an edge-streaming and pre-signed storage mechanism:
1. When uploading, the client requests an upload authorization or transmits the multipart stream through a dedicated Edge handler.
2. The server verifies session validity, course enrollment, file metadata, MIME type magic numbers, and size constraints (<= 20 MiB) in accordance with BR-06/NFR-08.
3. The file is piped to Cloudflare R2 with a content-addressable or UUID-based object key (`courses/{courseId}/materials/{materialId}` or `assignments/{assignmentId}/submissions/{studentId}_{filename}`).
4. Upon successful storage in R2, the metadata record (file URL, object key, size, MIME type, upload timestamp) is atomically committed to PostgreSQL.
5. In accordance with NFR-06, the upload is reported as successful only after both R2 persistence and PostgreSQL transaction commits succeed.

## Alternatives Considered
1. **PostgreSQL `BYTEA` / Large Object Storage**:
   - *Pros*: Stored in the same database transaction as the record.
   - *Cons*: Drastically degrades database performance, bloats memory and backups, quickly exceeds Neon/Supabase free tier database size caps (500 MB).
2. **AWS S3 Standard Storage**:
   - *Pros*: Industry standard object storage.
   - *Cons*: AWS charges substantial egress bandwidth fees and requires credit card verification, introducing financial and setup friction.
3. **Local Filesystem Storage**:
   - *Pros*: Simple filesystem API calls.
   - *Cons*: Completely incompatible with ephemeral, stateless serverless edge workers on Cloudflare Pages.

## Consequences
### Positive
- **Zero Egress Bandwidth Fees**: Cloudflare R2 charges $0 for data egress, making student downloads and file reviews free and unlimited within tier caps.
- **S3 API Compatibility**: Utilizes standard `@aws-sdk/client-s3` or Cloudflare Worker native R2 bindings (`env.R2_BUCKET`), making code transferable and testable.
- **Database Scalability**: Keeps the PostgreSQL relational database lean, fast, and focused purely on relational schema and indexing.
- **Reliability & Integrity**: Aligns with NFR-06 requirements by ensuring two-phase validation before marking submissions as confirmed.

### Negative / Trade-offs
- **Orphan File Handling**: In the rare event of a database transaction failure after an R2 file write, an orphaned blob could remain in storage; a periodic cleanup script or transactional rollback logic is required.
