# Vible — Software Requirements Specification (SRS)

> **Status:** Initial outline for team review  
> **Project team:** Team 06 — VibeCodeToByteCode  
> **Source baseline:** PA0 (`06-PA0.pdf`)  
> **Document purpose:** Organize the requirements to be clarified before implementation. This is a working outline, not an approved final SRS.  
>
> **Labeling convention**
> - **[PA0 fact]** — explicitly stated in the submitted PA0.
> - **[Proposed]** — a recommendation to discuss and approve.
> - **[TBD]** — not specified in PA0 and needs a decision.
> - **[Assumption]** — a temporary assumption used only to make the outline actionable; confirm or reject it.

---

## Document control

| Item | Value |
|---|---|
| Project | Vible |
| Team | 06 — VibeCodeToByteCode |
| Team lead | Huỳnh Trung Ngạn |
| Communication channel | Discord |
| Version | 0.1 — outline |
| Status | Draft; not yet approved |
| Last updated | 2026-10-15 |

## 1. Introduction

### 1.1 Purpose

**[Proposed]** This SRS outline will help the team specify, review, implement, and test Vible's requirements. The team should replace TBDs and approve proposed requirements before treating them as commitments.

### 1.2 Project overview

- **[PA0 fact]** Vible is described as a modern web platform to help teachers manage classroom activities and share course materials.
- **[PA0 fact]** The problem statement describes classroom tasks and resources being spread across chat apps such as Zalo/Discord, spreadsheets, and email.
- **[PA0 fact]** Moodle is mentioned as an existing LMS, with PA0 expressing concern that traditional LMS platforms may be obsolete or have features behind a paywall.
- **[PA0 fact]** The intended users are teachers and students.
- **[PA0 fact]** The proposed platform is a single-page web application (SPA), with a possible later move to a Progressive Web App (PWA).

### 1.3 Objectives

- **[PA0 fact]** Provide teachers with a place to create courses, publish announcements, distribute assignments, and manage classes.
- **[PA0 fact]** Let students access course materials, submit homework, view grades and feedback, and participate in class discussions.
- **[Proposed]** Validate the objectives using demonstrable end-to-end workflows and acceptance tests.

### 1.4 Definitions and abbreviations

| Term | Meaning |
|---|---|
| SRS | Software Requirements Specification |
| SPA | Single-page application |
| PWA | Progressive Web App |
| TBD | To be decided / confirmed |
| FR | Functional requirement |
| NFR | Non-functional requirement |
| UC | Use case |

**[TBD]** Add any course-specific terminology or definitions required by the lecturer.

## 2. Scope

### 2.1 In scope

**[PA0 fact]** PA0 identifies the following as must-have:
1. User Management — user authentication and identity verification.
2. Roster Management — manage enrollments and student rosters.
3. Course Content & Material Sharing — upload and organize syllabus, documents, videos, and class resources.
4. Classroom Activities Management — manage coursework and distribute assignments.
5. Assignment & Grading — provide grades and feedback on students' submitted work.
6. Announcements & Class Discussions — channels for announcements and discussions between teachers and students.

**[PA0 fact]** The scope description also mentions enrollment via roster/invite, material distribution, assignment submission, online grading/feedback, and course announcement channels.

### 2.2 Out of scope

**[PA0 fact]**
- Complex institutional administrative integrations.
- Real-money payment gateway integration for commercial course enrollment.

**[PA0 fact]** The following feature groups are marked *not must-have* in PA0:
- Class meetings.
- Attendance tracking.
- In-app private messaging.
- Calendar and push notifications.

**Note:** “Not must-have” is not necessarily a permanent prohibition. **[Proposed]** Treat these as deferred unless the team and course staff approve a scope change.

### 2.3 Target users

| User group | PA0 description | Requirements to clarify |
|---|---|---|
| Teachers | Create courses, publish announcements, design/distribute assignments, manage courses easily. | **[TBD]** Can teachers co-teach? Who can edit or delete a course? |
| Students | Access materials, submit homework, view grades/feedback, engage in class discussions. | **[TBD]** Can students join through an invite code, link, or teacher enrollment? |

**[TBD]** PA0 does not specify an administrator role. Do not add one without a team decision.

## 3. Overall description

### 3.1 Product perspective

- **[PA0 fact]** Proposed product form: SPA, with a possible later PWA.
- **[PA0 fact]** Proposed frontend: Vue.js (Composition API), TypeScript/JavaScript (with JSDoc), HTML, Tailwind CSS.
- **[PA0 fact]** Proposed backend: Node.js; framework listed as Nuxt 4.
- **[PA0 fact]** Database is not final: PostgreSQL, MongoDB, or Firebase are listed as options.

**[TBD]** Confirm the intended Nuxt version, backend/API structure, database, hosting/deployment platform, authentication provider, and file-storage provider. PA0 lists these as choices or open questions rather than final decisions.

### 3.2 User characteristics

**[PA0 fact]** The two stated user groups are teachers and students.

**[Proposed]** Design for users with varied technical experience and for common desktop and mobile browser sizes. Confirm this as a requirement before committing to it.

### 3.3 Constraints

- **[PA0 fact]** The implementation phase is described as three weeks.
- **[PA0 fact]** The team identifies file uploads/cloud storage, Nuxt 4 integration/deployment, and member availability as project risks.
- **[PA0 fact]** The team contract expects each member to spend at least 15 hours per week.
- **[TBD]** Define permitted file types, maximum file size, storage limits, supported browsers, and deployment constraints.

### 3.4 Assumptions and dependencies

- **[Assumption — confirm]** Users will access Vible through a modern web browser.
- **[Assumption — confirm]** Users need an authenticated session to perform role-specific course actions.
- **[TBD]** Identify external dependencies for identity verification, file storage, email, and hosting.
- **[TBD]** Record any lecturer-provided deployment or evaluation requirements when confirmed.

## 4. Functional requirements

The statements below are **draft candidates**, derived from PA0 feature descriptions and expanded only enough to support review. They are not approved requirements. The team should confirm permissions, exceptions, and detailed behavior before implementation.

Priority labels:
- **Must-have in PA0** — PA0 explicitly marks the feature group as must-have.
- **TBD** — detailed requirement behavior still needs confirmation.

### FR-01 — User management, authentication, and identity verification

- **Source:** [PA0 fact] Feature 1 is “User Management” and describes user authentication and identity verification; marked must-have.
- **[Proposed] FR-01.1:** The system shall provide a sign-in flow for registered users.
- **[Proposed] FR-01.2:** The system shall reject invalid authentication attempts with an appropriate error message.
- **[TBD]** Registration method, identity-verification method, password reset, session expiry, and account recovery.
- **[TBD]** Whether users can choose a role or require an invitation/approval.

**Acceptance checks to define**
- [ ] A valid registered account can sign in.
- [ ] Invalid credentials do not create an authenticated session.
- [ ] Unauthenticated users cannot perform protected course actions.
- [ ] Identity-verification and recovery flows are tested once their behavior is agreed.

### FR-02 — Roster and enrollment management

- **Source:** [PA0 fact] Feature 2 is “Roster Management,” to manage enrollments and student rosters; marked must-have. Scope mentions enrollment via roster/invite.
- **[Proposed] FR-02.1:** The system shall allow an authorized teacher to view the roster for a course they manage.
- **[Proposed] FR-02.2:** The system shall support the team-approved enrollment method for adding students to a course.
- **[TBD]** Invite link/code behavior, roster import/export, removing students, duplicate enrollment handling, and whether students can self-enroll.

**Acceptance checks to define**
- [ ] An authorized teacher can view the correct course roster.
- [ ] An approved enrollment action adds the student to the correct course.
- [ ] Duplicate or invalid enrollment attempts have defined outcomes.
- [ ] A user without permission cannot alter another course's roster.

### FR-03 — Course content and material sharing

- **Source:** [PA0 fact] Feature 3 covers uploading and organizing syllabus, documents, videos, and class resources; marked must-have.
- **[Proposed] FR-03.1:** An authorized teacher shall be able to add course materials to a course they manage.
- **[Proposed] FR-03.2:** Enrolled students shall be able to view or access materials published for their course.
- **[TBD]** Supported file formats, size limits, folder/category structure, replacement/deletion, link-based resources, and storage provider.

**Acceptance checks to define**
- [ ] A teacher can publish a permitted material item.
- [ ] An enrolled student can access the published item.
- [ ] A non-enrolled user cannot access restricted course material.
- [ ] Invalid file types and oversized files are handled according to agreed rules.
- [ ] Upload failures are reported without showing a false success state.

### FR-04 — Classroom activities and assignment creation

- **Source:** [PA0 fact] Feature 4 covers managing coursework and sending assignments; marked must-have.
- **[Proposed] FR-04.1:** An authorized teacher shall be able to create an assignment for a course they manage.
- **[Proposed] FR-04.2:** An assignment shall display the information agreed by the team, potentially including title, instructions, and deadline.
- **[TBD]** Required assignment fields, editing after publication, draft/published states, deadline/time zone, and late-work policy.

**Acceptance checks to define**
- [ ] A teacher can create and publish a valid assignment.
- [ ] Enrolled students can see the assignment details.
- [ ] Invalid or incomplete assignment data produces clear validation feedback.
- [ ] Deadline and late-submission behavior matches the agreed policy.

### FR-05 — Assignment submission and grading

- **Source:** [PA0 fact] Feature 5 covers providing grades/feedback for submitted work; marked must-have. Scope also mentions assignment submission and online grading/feedback.
- **[Proposed] FR-05.1:** An enrolled student shall be able to submit work for an assignment that accepts submissions.
- **[Proposed] FR-05.2:** An authorized teacher shall be able to review a submission and record a grade and feedback.
- **[Proposed] FR-05.3:** A student shall be able to view the grade and feedback for their own submission when released.
- **[TBD]** File versus text submissions, resubmissions, grading scale, grade release, late work, and whether grades can be edited.

**Acceptance checks to define**
- [ ] A valid submission is associated with the correct student and assignment.
- [ ] The system records a submission status and time if approved as part of the design.
- [ ] A teacher can grade only submissions they are authorized to review.
- [ ] Students can view only their own grade/feedback unless another policy is approved.
- [ ] Upload or save failures do not falsely mark work as submitted or graded.

### FR-06 — Announcements and class discussions

- **Source:** [PA0 fact] Feature 6 covers channels for announcements and discussions between teachers and students; marked must-have.
- **[Proposed] FR-06.1:** An authorized teacher shall be able to publish an announcement to a course they manage.
- **[Proposed] FR-06.2:** Students enrolled in that course shall be able to view its announcements.
- **[TBD]** Discussion posting permissions, replies, editing/deleting posts, moderation, ordering, and notifications.

**Acceptance checks to define**
- [ ] A teacher can publish an announcement to the correct course.
- [ ] Enrolled students can view it.
- [ ] A user without permission cannot publish or modify another course's announcement.
- [ ] Discussion behavior matches the rules approved by the team.

## 5. Non-functional requirements

**Status:** PA0 does not define measurable non-functional requirements. The items below are proposed topics, not confirmed commitments.

| ID | Quality area | Proposed requirement to specify | Status |
|---|---|---|---|
| NFR-01 | Security | Define authentication, server-side authorization, secure handling of credentials, and access controls for submissions/materials. | **[Proposed; targets TBD]** |
| NFR-02 | Performance | Specify a response-time target and test load for key flows. | **[TBD]** |
| NFR-03 | Usability | Define supported viewport sizes and usability expectations for teacher/student workflows. | **[Proposed; criteria TBD]** |
| NFR-04 | Reliability | Define expected behavior for failed uploads, network errors, and failed saves. | **[Proposed; criteria TBD]** |
| NFR-05 | Data integrity | Define ownership and access rules for courses, rosters, submissions, grades, and feedback. | **[Proposed; rules TBD]** |
| NFR-06 | Maintainability | Agree on code conventions, review practices, and automated test expectations. | **[Partly supported by team contract; technical criteria TBD]** |
| NFR-07 | Compatibility | Specify browsers and devices supported for evaluation. | **[TBD]** |
| NFR-08 | Availability/backup | Decide whether backups or availability targets are required for the project. | **[TBD]** |

Do not invent numeric performance or availability targets. Agree on targets that the team can test and demonstrate.

## 6. Use cases

**[Proposed]** Start with these use cases, then create a use case diagram if required by the course instructions.

| Use case ID | Use case | Primary actor | Related requirement |
|---|---|---|---|
| UC-01 | Sign in | Teacher / Student | FR-01 |
| UC-02 | View course roster | Teacher | FR-02 |
| UC-03 | Enroll a student | Teacher or approved enrollment actor **[TBD]** | FR-02 |
| UC-04 | Publish course material | Teacher | FR-03 |
| UC-05 | View course material | Student | FR-03 |
| UC-06 | Create/publish assignment | Teacher | FR-04 |
| UC-07 | Submit assignment | Student | FR-05 |
| UC-08 | Grade submission and provide feedback | Teacher | FR-05 |
| UC-09 | View own grade and feedback | Student | FR-05 |
| UC-10 | Publish announcement | Teacher | FR-06 |
| UC-11 | View announcement / participate in discussion | Student / Teacher | FR-06 |

**[TBD]** For each use case, document preconditions, trigger, main flow, alternative/error flows, postconditions, and related acceptance tests.

## 7. Data requirements and conceptual entities

**[Proposed]** Review whether the following conceptual entities are needed. This is not a finalized database schema.

- User
- Course
- Enrollment / roster membership
- Course material
- Assignment
- Submission
- Grade / feedback
- Announcement
- Discussion post

**[TBD]** Decide identifiers, required fields, relationships, deletion behavior, data retention, and whether grade and feedback belong to a submission or a separate entity.

**[TBD]** Select PostgreSQL, MongoDB, or Firebase; PA0 does not make a final choice.

## 8. External interfaces and technology

### 8.1 User interface

- **[PA0 fact]** Vue.js (Composition API), TypeScript/JavaScript with JSDoc, HTML, and Tailwind CSS are listed for the frontend.
- **[PA0 fact]** PA0's team-role section mentions UI/UX mockups aligned with NuxtUI and Tailwind CSS.
- **[TBD]** Confirm the UI component library and any accessibility or responsive-layout requirements.

### 8.2 Software and service interfaces

- **[PA0 fact]** Node.js and Nuxt 4 are listed in the technology choices.
- **[TBD]** Confirm API style, authentication provider, database, file storage, hosting, and deployment pipeline.
- **[TBD]** Document third-party interfaces only after the providers are selected.

## 9. Risks, constraints, and open questions

### 9.1 Risks identified in PA0

1. Underestimating rich file-upload and cloud-storage integration effort during the three-week coding window.
2. Integration issues or a steep learning curve with full-stack Nuxt 4 architecture and deployment.
3. Key members becoming unavailable or overloaded near academic deadlines.

**[Proposed]** Reduce these risks by testing a minimal upload path and deploying a small end-to-end application early, rather than postponing integration until the final week.

### 9.2 Open questions from PA0

PA0 lists these questions for the TA:
1. Are particular third-party storage/authentication providers recommended, and what performance benchmarks or submission formats are expected for PA evaluations?
2. How detailed should AI usage log entries be in weekly status reports?
3. How are primary role titles versus total task completion considered when judging individual contributions?

**[TBD]** Record the TA's answers here when received. Do not treat them as resolved yet.

### 9.3 Additional decisions for the team

- [ ] Confirm registration and identity verification.
- [ ] Confirm teacher/student permissions and server-side authorization rules.
- [ ] Select the database and document the reason.
- [ ] Select file storage and define file restrictions.
- [ ] Define enrollment and invitation behavior.
- [ ] Define submission, deadline, resubmission, grading, and grade-release rules.
- [ ] Define discussion permissions and moderation behavior.
- [ ] Confirm supported browsers/devices and measurable quality targets.
- [ ] Confirm required artifacts and evaluation criteria from the official PA instructions.

## 10. Verification and acceptance strategy

**[Proposed]** Each approved functional requirement should have at least one testable acceptance check. Use a mix of:

- Unit tests for validation and business rules.
- Integration tests for database, authentication, and file-storage interactions.
- End-to-end tests for the main teacher and student workflows.
- Authorization tests for attempts to access or modify another user's data.
- Manual exploratory testing for responsive UI and error messages.

**[TBD]** Agree on test framework, test environment, minimum evidence required, and any coverage target. PA0 does not state a required framework or coverage percentage.

### Acceptance checklist for the MVP

- [ ] A teacher can authenticate and access teacher-appropriate functions.
- [ ] A student can authenticate and access student-appropriate functions.
- [ ] A teacher can manage a course roster using the agreed enrollment process.
- [ ] A teacher can publish course materials and enrolled students can access them.
- [ ] A teacher can create an assignment and students can submit work according to the agreed rules.
- [ ] A teacher can grade submissions and provide feedback.
- [ ] Students can view their own grades and feedback according to the agreed release rules.
- [ ] Teachers can publish course announcements and students can view them.
- [ ] Unauthorized access attempts are rejected.
- [ ] Main workflows and important failure cases are tested.
- [ ] The agreed deployment can be demonstrated.
- [ ] Known limitations are documented.

**Note:** This checklist is a proposed MVP acceptance baseline, not an official course rubric.

## 11. Requirements traceability

**[Proposed]** Maintain a lightweight traceability table throughout implementation.

| Requirement ID | Use case | Implementation task / issue | Test case | Status |
|---|---|---|---|---|
| FR-01 | UC-01 | **[TBD]** | **[TBD]** | Not started |
| FR-02 | UC-02, UC-03 | **[TBD]** | **[TBD]** | Not started |
| FR-03 | UC-04, UC-05 | **[TBD]** | **[TBD]** | Not started |
| FR-04 | UC-06 | **[TBD]** | **[TBD]** | Not started |
| FR-05 | UC-07, UC-08, UC-09 | **[TBD]** | **[TBD]** | Not started |
| FR-06 | UC-10, UC-11 | **[TBD]** | **[TBD]** | Not started |

Update status only when supported by the team's actual implementation and test evidence.

## 12. Review and approval checklist

### Requirements quality

- [ ] Each requirement has a unique ID.
- [ ] Requirements use clear, unambiguous language.
- [ ] Requirements describe observable behavior rather than implementation guesses.
- [ ] Every functional requirement has acceptance criteria.
- [ ] Permissions are defined for teacher and student actions.
- [ ] Error, boundary, and unauthorized-access cases are considered.
- [ ] Proposed items and unresolved TBDs have been reviewed with the team.
- [ ] Requirements are traceable to use cases, tasks, and tests.

### Scope and technical decisions

- [ ] The six PA0 must-have feature groups remain covered.
- [ ] Optional PA0 features are not silently promoted into must-have scope.
- [ ] Database, authentication, file storage, and deployment decisions are recorded.
- [ ] Measurable non-functional targets are agreed rather than invented.
- [ ] Official PA instructions and TA clarifications have been checked.

### Team review and document status

- [ ] Business analyst prepares the draft for team review.
- [ ] Developer checks feasibility and testability.
- [ ] Designer/architect checks data and architecture implications.
- [ ] Team lead coordinates review and records decisions.
- [ ] At least one other member reviews the document, consistent with the team contract.
- [ ] Final SRS version and approval date are recorded.

---

## Appendix A — PA0 baseline facts

- **Team:** 06 — VibeCodeToByteCode.
- **Team lead:** Huỳnh Trung Ngạn.
- **Project:** Vible.
- **Target users:** Teachers and students.
- **Must-have feature groups:** User management; roster management; course content/material sharing; classroom activities; assignment/grading; announcements/class discussions.
- **Features marked not must-have:** Class meetings; attendance tracking; in-app messaging; calendar/push notifications.
- **Proposed platform:** SPA, with a possible later PWA.
- **Listed technology choices:** Vue.js, TypeScript/JavaScript with JSDoc, HTML, Tailwind CSS, Node.js, Nuxt 4; database options PostgreSQL/MongoDB/Firebase (not final).
- **Out of scope:** Complex institutional integrations and real-money payment gateway integration for commercial course enrollment.
- **Implementation period stated in PA0:** Three weeks.
- **Risks:** File uploads/cloud storage, full-stack integration/deployment, and team-member availability.
- **Team process:** Discord for communication; GitHub repository for project files; peer review; task board ownership and due dates; individual AI usage logs for each PA.

## Appendix B — Change log

| Version | Date | Change |
|---|---|---|
| 0.1 | 2026-10-15 | Initial SRS outline drafted from PA0; proposed items and unresolved decisions explicitly labeled. |
