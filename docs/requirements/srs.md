# Vible — Software Requirements Specification

## 2. Functional Requirements

| ID | Requirement | Feature | Priority | Source |
| --- | --- | --- | --- | --- |
| FR-01A | The system shall allow users to register new accounts. | F01 | Must | PA1 Section 2.4, F01. |
| FR-01B | The system shall allow users to log in using credentials. | F01 | Must | PA1 Section 2.4, F01. |
| FR-01C | The system shall enforce role-based access for every user (Student or Teacher). | F01 | Must | PA1 Section 2.4, F01. |
| FR-02A | The system shall allow teachers to create new courses. | F02 | Must | PA1 Section 2.4, F02. |
| FR-02B | The system shall allow teachers to rename or delete courses they own. | F02 | Must | PA1 Section 2.4, F02. |
| FR-03A | The system shall allow the course teacher to approve or reject pending enrollment requests. | F03 | Must | PA1 Section 2.4, F03; PA2 UC-06. |
| FR-03B | The system shall allow teachers to remove students from courses. | F03 | Must | PA1 Section 2.4, F03. |
| FR-03C | The system shall allow students to request enrollment using an invite code or link, placing the request in the course’s pending list. | F03 | Must | PA1 Section 2.4, F03; PA2 UC-06. |
| FR-04A | The system shall allow teachers to publish or delete materials in courses they own. | F04 | Must | PA1 Section 2.4, F04. |
| FR-04B | The system shall allow enrolled students to view / download published course materials. | F04 | Must | PA1 Section 2.4, F04. |
| FR-05A | The system shall allow teachers to create in-app assignments with a due date. | F05 | Must | PA1 Section 2.4, F05. |
| FR-05B | The system shall allow enrolled students to submit a file for an assignment when permitted by its deadline and late-submission setting. | F05 | Must | PA1 Section 2.4, F05. |
| FR-05C | The system shall mark accepted submissions made after the assignment deadline as late. | F05 | Must | PA1 Section 2.4, F05; PA2 UC-13. |
| FR-05D | The system shall allow the course teacher to enable or disable late submissions for each assignment. | F05 | Must | PA1 Section 2.4, F05; PA2 UC-13. |
| FR-05E | The system shall allow students to remove their own submission and submit again, except after the deadline when late submissions are disabled. | F05 | Must | PA1 Section 2.4, F05; PA2 UC-13. |
| FR-06A | The system shall allow teachers to grade and give feedback to student submissions. | F06 | Should | PA1 Section 2.4, F06. |
| FR-07A | The system shall provide a dedicated channel for each course where teachers post announcements for students who are enrolled in that course. | F07 | Should | PA1 Section 2.4, F07. |
| FR-07B | The system shall provide a dedicated channel for each course where teachers and students who are enrolled in that course can exchange messages. | F07 | Should | PA1 Section 2.4, F07. |
| FR-08A | The system shall send notifications to users via a dedicated channel or web page. | F08 | Could | PA1 Section 2.4, F08. |
| FR-08B | The system shall send notifications to users via registered emails. | F08 | Could | PA1 Section 2.4, F08. |
| FR-09 | The system shall allow users to update their profile details (display name, avatar, bio). | F09 | Could | PA1 Section 2.4, F09. |

## 3. Non-Functional Requirements

| ID | Category | Requirement (measurable) | How it will be verified |
| --- | --- | --- | --- |
| NFR-01 | Performance | Under 50 concurrent users, the course-list, material-list, and assignment-list APIs shall each respond within 2 seconds at P95, with fewer than 1% unexpected server errors during a 10-minute test. File transfer time is excluded. | After a 1-minute warm-up, send one request per user every 5 seconds, evenly across the three APIs. Use 20 courses, 500 enrollments, 200 material records, and 200 assignments. Record the test environment, network latency, P95 response time, and error rate for each API. |
| NFR-02 | Security — access control | All protected Must-have operations shall enforce authentication and applicable role, course-ownership, and enrollment permissions on the server. Unauthorized requests shall disclose no protected data and make no changes. | Test protected APIs and file access as an unauthenticated user, enrolled student, non-enrolled student, course owner, and another teacher. Verify that every prohibited action is denied without exposing data or changing stored records. |
| NFR-03 | Usability | At least 4 of 5 first-time student participants shall independently request enrollment, locate course material, and submit a valid assignment file within 5 minutes of active task time. Sign-in time and waiting for teacher approval are excluded. | Provide each participant with a prepared account, valid invitation, and file, and have a teacher available to approve the request. Pause timing while approval is pending. Record completion time, success, and assistance; successful completion requires no task guidance. |
| NFR-04 | Accessibility | Registration, login, enrollment, material access, and assignment submission shall be operable entirely by keyboard, with visible focus indicators. Inputs shall have programmatic labels, and validation errors shall identify the affected fields. | Complete all five workflows using only the keyboard. Inspect focus indicators, input labels, and error associations with browser accessibility tools. No inaccessible control may prevent completion. |
| NFR-05 | Compatibility and layout | All Must-have acceptance scenarios shall pass on the stable versions of Chrome, Edge, Firefox, and Safari selected at the test baseline. At viewport widths of 360 and 1366 CSS pixels, controls shall remain readable and usable without overlapping or being clipped. | Record browser versions and operating systems. Run the scenarios at both widths and inspect the layout. Wide tables may scroll within their own containers; essential content and controls must remain accessible. |
| NFR-06 | Reliability and data integrity | The system shall confirm submission success only after both the file and its submission record are persistently stored. Across 10 interrupted or failed upload/save trials, no incomplete submission shall be reported as successful. Previously accepted submissions shall remain accessible unless explicitly removed by the student. | Interrupt uploads and simulate storage and database failures. Check the user message, stored file, and submission record after each trial. Verify that any previously accepted submission not explicitly removed remains accessible. |
| NFR-07 | Security — transport and credentials | The deployed application shall use HTTPS for authentication and protected data and file access. Passwords shall not appear in plaintext in persistent storage, application logs, or API responses. | Inspect deployed requests, a test-account database record, logs, and API responses. Confirm HTTPS use and verify that no plaintext password is retained or returned. |

## 4. Business Rules

| ID | Rule | Source |
| --- | --- | --- |
| BR-01 | Each account has a unique email address and exactly one role: Student or Teacher. | FR-01A, FR-01C; UC-01. |
| BR-02 | Each course has a mandatory name and exactly one teacher as its owner. A teacher may own multiple courses and may view and manage only their own courses. Course deletion requires confirmation. | FR-02A, FR-02B; UC-04. |
| BR-03 | A student may request enrollment using an invite code or link. The request remains pending until the course teacher approves or rejects it. Approval enrolls the student; rejection does not. Duplicate pending requests and enrollments are prohibited. | FR-03A, FR-03C; UC-06. |
| BR-04 | Only the course owner and enrolled students may access protected course materials, assignments, announcements, and discussions. Pending or rejected applicants have no such access. Removing a student from the roster revokes their course access. | FR-03B, FR-04B; NFR-02; UC-06. |
| BR-05 | Only the course owner may publish or delete course materials. Enrolled students may view or download published materials. | FR-04A, FR-04B; UC-05. |
| BR-06 | Uploaded material and submission files must be non-empty, at most 20 MiB, and of a permitted type. The server must reject invalid files with a clear error and must not publish or accept them as successful submissions. The permitted file-type list must be confirmed before this rule is baselined. | FR-04A, FR-05B; UC-05, UC-13. File-type list pending. |
| BR-07 | Each assignment has a deadline and a teacher-controlled late-submission setting. Submissions made later than the deadline are accepted only when late submissions are enabled and are marked late. When late submissions are disabled, submission and removal are blocked after the deadline. | FR-05A, FR-05B, FR-05C, FR-05D, FR-05E; UC-13. |
| BR-08 | Only the course teacher may grade submissions, provide grading feedback, and post course-channel announcements. The teacher and enrolled students may participate in course discussions. These capabilities retain the Should-have priority of F06 and F07. | FR-06A, FR-07A, FR-07B; PA1 Section 2.4. |
| BR-09 | A student may have at most one current submission per assignment. The student must remove an existing submission before submitting again, subject to the deadline and late-submission rules. Students may remove only their own submissions. | FR-05B, FR-05E; UC-13. |

