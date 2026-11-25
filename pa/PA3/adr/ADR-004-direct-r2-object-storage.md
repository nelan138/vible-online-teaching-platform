# ADR-004: Server-Mediated Edge-Streaming Cloudflare R2 Object Storage for Materials and Submissions

| Metadata | Details |
| :--- | :--- |
| **Status** | Accepted (Revised) |
| **Date** | 2026-11-05 (Revised 2026-11-14) |
| **Author** | Trương Hiển Long (24127445) |
| **Deciders** | Trương Hiển Long (24127445) |
| **Supersedes** | None (this revision replaces the 2026-11-05 draft of ADR-004 in place) |

---

## Context
Vible allows instructors to upload course learning materials (PDFs, lecture slides, documents) and allows students to submit files for assignments (BR-05, BR-06, FR-04A, FR-05B). BR-06 states that uploaded files must not be empty, must be at most 20 MiB, and must have an allowed file type. NFR-08 requires these rules to be enforced **on the server**, verified against a test set containing an allowed file, an empty file, a file of exactly 20 MiB, a file of 20 MiB + 1 byte, a disallowed type, and a file whose extension conflicts with its validated content type. NFR-06 requires that a submission is reported as successful only after both its file and its record are persistently stored, and that any previously accepted submission remains accessible after a failed attempt.

Relational databases (PostgreSQL) are ill-suited for storing large binary objects (BLOBs), which cause database bloat, slow down backups, and degrade transactional query performance. Files are therefore stored in an external object store (Cloudflare R2). Integrating object storage with our serverless runtime (Nuxt/Nitro on Cloudflare Pages, ADR-001, and Neon PostgreSQL, ADR-002) raises three questions:

1. **Upload transport and server-side validation**:
   - *Pre-signed direct uploads (Client → R2)* offload bandwidth from the Worker, but the object lands in the bucket before the server can inspect its content. A signed `Content-Length` can bound the size, but the server cannot verify magic bytes or reject a disallowed type before the file is stored, so BR-06/NFR-08 can only be enforced after the fact.
   - *Worker-mediated uploads (Client → Worker → R2)* keep validation on the server, but buffering a 20 MiB file in the isolate (via `arrayBuffer()` or an in-memory multipart parser such as h3's `readMultipartFormData`) consumes a large share of the 128 MB isolate memory limit and adds parsing CPU cost against the 10 ms CPU limit of the Workers Free plan.
2. **Dual-store consistency**:
   - R2 and Neon PostgreSQL are independent systems with no shared transaction coordinator (no two-phase commit). A write to both cannot be committed atomically, regardless of which PostgreSQL driver is used.
   - Partial failures (network timeouts, constraint violations, isolate termination between the R2 write and the database write) must be handled explicitly; otherwise unreferenced objects accumulate in the bucket.
3. **Object key namespace and resubmissions**:
   - Object keys derived from user-supplied filenames are vulnerable to path traversal and character-injection issues, and two uploads with the same filename would overwrite each other.
   - Students may resubmit an assignment (submission lifecycle: `SUBMITTED_ON_TIME`/`SUBMITTED_LATE` → `RESUBMITTED`). A failed resubmission must not destroy the previously accepted file (NFR-06), and keeping prior attempts lets teachers check whether earlier work was on time (BR-07 late flag).

---

## Decision
We store all binary file assets in **Cloudflare R2** using **server-mediated streaming** through the native R2 Worker binding, with **application-level compensating deletes and a scheduled reconciliation job** for dual-store consistency.

### 1. Upload Route: Server-Mediated Streaming via the Web Streams API
Direct client-to-R2 pre-signed uploads are not used. All uploads pass through Nitro server routes (`PUT /api/courses/:courseId/materials` and `PUT /api/assignments/:assignmentId/submissions`), which access the bucket through the R2 binding exposed by the `cloudflare-pages` preset (`event.context.cloudflare.env.R2_BUCKET`).

- **Raw-body upload contract**: The client sends the file bytes as the raw request body (not `multipart/form-data`), with:
  - `Content-Type`: the declared MIME type of the file,
  - `Content-Length`: the exact file size in bytes (required),
  - `X-File-Name`: the original filename, percent-encoded (RFC 3986).

  A raw body keeps the file's first bytes at the head of the stream (so they can be sniffed) and avoids buffering by a multipart parser.
- **Pre-read header checks (BR-06, NFR-08)**: Before reading any body bytes, the handler rejects:
  - a missing or non-numeric `Content-Length` → `411 Length Required`,
  - `Content-Length == 0` → `400 Bad Request` (empty file),
  - `Content-Length > 20,971,520` (20 MiB) → `413 Content Too Large`; a file of exactly 20,971,520 bytes is accepted,
  - a declared MIME type or a filename extension outside the allow-list → `415 Unsupported Media Type`.
- **Magic-byte sniffing at the stream head**: The handler reads from the body stream until it has buffered at least the longest signature it needs (at most a few KiB; a single chunk may be shorter than this). It then checks the bytes against the allow-list, and checks that the **declared MIME type and the filename extension both agree with the detected type**:

  | Allowed type | Extensions | Signature (hex / ASCII) |
  | :--- | :--- | :--- |
  | PDF | `.pdf` | `25 50 44 46 2D` (`%PDF-`) |
  | Office Open XML | `.docx`, `.pptx`, `.xlsx` | `50 4B 03 04` (ZIP container) |
  | ZIP archive | `.zip` | `50 4B 03 04` |
  | PNG | `.png` | `89 50 4E 47 0D 0A 1A 0A` |
  | JPEG | `.jpg`, `.jpeg` | `FF D8 FF` |

  On mismatch the body stream is cancelled and the handler returns `415 Unsupported Media Type`; nothing is written to R2. The final allow-list must match the "allowed file types" defined for BR-06 in the SRS; formats without a signature (e.g. plain text) or legacy OLE formats (`.doc`, `.ppt`, signature `D0 CF 11 E0`) must be added to this table explicitly if they are allowed.
- **Re-assembling the stream**: Reading the head consumes those bytes from the body stream, so the handler builds a new stream that first emits the buffered head bytes and then the remainder of the body.
- **Length-checked streaming into R2**: The re-assembled stream is piped through `new FixedLengthStream(contentLength)` and the readable side is passed to `R2_BUCKET.put(key, readable, { httpMetadata: { contentType } })`. The R2 binding requires a stream of known length, which `FixedLengthStream` provides; it also errors if the client sends more or fewer bytes than declared, so the stored size always equals the validated `Content-Length`. If the stream errors mid-transfer, `put()` rejects and R2 does not commit a partial object.
- **Resource use**: The file is never held in memory as a whole; only the sniffed head and the chunks in flight are buffered, so memory stays well below the 128 MB isolate limit. Waiting on network I/O does not count toward CPU time. Because the sniffing step and the re-assembled stream run JavaScript per chunk, the CPU cost of a 20 MiB upload is not zero; it will be measured on the deployed Worker during implementation, and the 10 ms Free-plan CPU limit is a known risk (see Consequences).

### 2. Dual-Store Consistency: Order of Operations, Compensating Delete, Reconciliation
Because R2 and PostgreSQL cannot share a transaction, consistency is achieved with ordered writes and compensating actions:

1. **Write to R2 first**: The validated stream is written to R2 under a new, never-reused UUID key (Section 3). Until the database row exists, the object is not referenced and is invisible to users.
2. **Commit metadata in PostgreSQL**: The metadata row (`file_key`, `original_filename`, `file_size_bytes`, `mime_type`, `submitted_at`, `is_late`, `is_current`) is written with `drizzle-orm/neon-http`. For a resubmission, demoting the previous attempt (`is_current = false`) and inserting the new row run together in one `db.batch([...])` call, which Neon's HTTP driver executes as a single non-interactive transaction. Either both statements commit or neither does, so the previous accepted submission stays current if the new write fails (NFR-06).
3. **Report success only after both writes (NFR-06)**: The route returns `201 Created` only after the R2 `put()` and the database commit have both succeeded.
4. **Compensating delete on database failure**:
   ```typescript
   const r2 = event.context.cloudflare.env.R2_BUCKET;
   try {
     await db.batch([
       db.update(submissions)
         .set({ isCurrent: false })
         .where(and(
           eq(submissions.assignmentId, assignmentId),
           eq(submissions.studentId, studentId),
           eq(submissions.isCurrent, true),
         )),
       db.insert(submissions).values({ id: submissionId, fileKey, isCurrent: true /* ... */ }),
     ]);
   } catch (dbError) {
     // Best-effort compensating delete of the new object only; never touches the
     // previous attempt. A failure here is left to the reconciliation job and must
     // not mask the original database error.
     event.waitUntil(r2.delete(fileKey).catch(() => {}));
     throw createError({ statusCode: 500, statusMessage: 'Submission failed; please retry.' });
   }
   ```
   Known limitation: if the database call fails ambiguously (e.g. a timeout after the server actually committed), the compensating delete can leave a row whose object is missing. The reconciliation job therefore checks both directions (step 5).
5. **Scheduled reconciliation job**: Cloudflare Pages Functions do not support Cron Triggers, so reconciliation runs as a **separate, small Worker** bound to the same R2 bucket and database, scheduled nightly (`0 3 * * *`, UTC):
   - It lists objects under the `courses/` and `assignments/` prefixes (the roots of the key schema in Section 3), paginating with the `cursor` returned by `R2_BUCKET.list()`, and keeps only objects whose `uploaded` timestamp is more than 24 hours old, so in-flight uploads are never touched.
   - It looks up those keys in `materials.file_key` and `submissions.file_key` and deletes objects with no matching row.
   - It reports (but does not delete) rows whose `file_key` has no object, for manual review.
   - Work is processed in bounded batches per run so that each invocation stays within Free-plan CPU limits; remaining work continues on the next run.

### 3. UUID-Based Object Keys and Resubmission History
Storage keys are never derived from user-supplied filenames:

- **Object key schema** (one canonical format, used by upload, download and reconciliation):
  - Course materials: `courses/{courseId}/materials/{materialId}.bin`
  - Assignment submissions: `assignments/{assignmentId}/submissions/{studentId}/{submissionId}.bin`

  All path segments are server-generated UUIDv4 values (PostgreSQL `gen_random_uuid()` or `crypto.randomUUID()`).
- **Filename as metadata only**: The original filename (e.g. `Lab1_Final_Report.pdf`) is sanitized (path separators and control characters removed, truncated to 255 characters) and stored only in the `original_filename VARCHAR(255) NOT NULL` column.
- **One row per attempt**: Each upload, including a resubmission, creates a new `submissions` row with a new `submissionId` and therefore a new object key. Earlier attempts are kept with `is_current = false`. A **partial unique index** `UNIQUE (assignment_id, student_id) WHERE is_current` guarantees exactly one current submission per student per assignment, replacing the previous plain `UNIQUE (assignment_id, student_id)` constraint. Because every attempt keeps its row, the reconciliation job never treats an earlier attempt's object as an orphan. Teachers grade the current submission; earlier attempts remain available for review with their own `submitted_at` and `is_late` values.
- **Authenticated downloads**: The bucket is private (no public bucket URL). Files are downloaded only through authenticated API routes that check course membership (BR-05), then stream the object from R2 with:
  - `Content-Type: <stored mime_type>`
  - `Content-Disposition: attachment; filename="<ASCII fallback with quotes and backslashes escaped>"; filename*=UTF-8''<percent-encoded original_filename>` (RFC 6266 / RFC 5987, so Vietnamese filenames are preserved)
  - `X-Content-Type-Options: nosniff`

---

## Alternatives Considered
1. **Pre-signed direct R2 uploads (client to bucket)**:
   - *Pros*: Upload traffic bypasses the Worker entirely and does not count against Worker CPU or request limits.
   - *Cons*: **Rejected**. A signed URL can bound the size, but the server cannot inspect magic bytes or the declared type before the object is stored, so invalid files enter the bucket and must be found and removed afterwards (weakening NFR-08). Uploads abandoned before the client confirms them also leave unreferenced objects, which would need R2 lifecycle rules or the same reconciliation job.
2. **PostgreSQL `BYTEA` / Large Object storage**:
   - *Pros*: File and metadata are stored in the same database transaction.
   - *Cons*: **Rejected**. Inflates database size and backups, degrades query performance, and quickly exceeds the Neon free plan's 0.5 GB storage per project.
3. **AWS S3 Standard storage**:
   - *Pros*: Industry-standard object storage with a mature SDK ecosystem.
   - *Cons*: **Rejected**. S3 data transfer out to the internet is billed at about $0.09/GB after the monthly free allowance, creating unpredictable costs as students repeatedly download materials. Cloudflare R2 charges no egress fees, and the in-Worker R2 binding needs no public endpoint, credentials, or request signing.
4. **Local filesystem storage**:
   - *Pros*: Simple filesystem API calls.
   - *Cons*: **Rejected**. Cloudflare Workers/Pages have no persistent local filesystem.

---

## Consequences
### Positive
- **Server-side enforcement of BR-06 / NFR-08**: Empty, oversize, disallowed and extension-mismatched files are rejected with a clear error before anything is written to R2, covering each case in the NFR-08 test set.
- **Bounded Worker memory**: Files are streamed, never fully buffered, so a 20 MiB upload stays far below the 128 MB isolate limit.
- **No egress fees**: R2 charges nothing for data egress; downloads only count against R2 Class B operations and Worker requests.
- **No lost submissions (NFR-06)**: The previous accepted submission remains current until a new attempt is fully stored and committed, and earlier attempts are retained for review.
- **Explicit consistency model**: No false atomicity; immediate compensating deletes plus a scheduled two-way reconciliation keep the bucket and the database aligned.

### Negative / Trade-offs
- **Worker request and CPU usage**: Every upload **and** download passes through the Worker and counts toward the 100,000 requests/day Free-plan limit (shared between Pages Functions and Workers). Upload CPU time must be measured; if a 20 MiB upload exceeds the 10 ms Free-plan CPU limit, options are moving to the Workers Paid plan or falling back to pre-signed uploads with asynchronous validation.
- **Raw-body upload contract**: The frontend must send the file as the raw request body with `Content-Length` and `X-File-Name` headers instead of a standard HTML form post.
- **Operational overhead**: A separate reconciliation Worker must be deployed and monitored, and compensating-delete logic must be maintained in every upload route.
- **Storage growth**: Retaining all resubmission attempts uses more R2 storage (within the 10 GB-month free allowance at the expected scale).
