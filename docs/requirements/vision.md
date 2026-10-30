# Vision

## Preliminary Problem Statement

Currently, instructors and students frequently manage classroom tasks using a fragmented combination of non-specialized communication channels (such as Zalo or Discord), shared spreadsheets, and emails. While traditional Learning Management Systems (LMS) like Moodle exist, they often suffer from obsolete user interfaces, bloated features, or critical functionalities locked behind paywalls.

Vible aims to solve this by providing a lightweight, modern web hub (built as a Single-Page Application and Progressive Web App). It is designed to run smoothly on any modern web browser across desktop and mobile devices.

## Product Position Statement

| Element | Content |
| --- | --- |
| For | Teachers and students |
| Who | People who need an intuitive online platform to host/manage classroom activities and distribute learning materials |
| Vible | Is an Online Teaching Platform (or Learning Management System ) |
| That | Provides an all-in-one hub to create courses, distribute materials, submit assignments, and provide grading feedback. |
| Unlike | Fragmented / Unspecilised chat apps (Zalo/Discord) or outdated traditional LMS platforms (Moodle). |
| Our product | Delivers a frictionless, lightweight SPA/PWA experience with a modern user interface and no unnecessary overhead. |

## Stakeholders and Users

| # | Stakeholder / user | Description | Main interests |
| --- | --- | --- | --- |
| 1 | Teacher / Instructor | End user | Wants an intuitive, easy-to-use online platform to set up classes, distribute materials, assignments, and easily provide feedback to students. |
| 2 | Student | End user | Wants a reliable portal to access course materials managed by their teachers. |

## Scope and Key Features

| ID | Feature | Description | Priority (M/S/C/W) |
| --- | --- | --- | --- |
| F01 | Authentication & authorization | Verify users (login/registration) and enforce role-based access for Teachers and Students. | Must |
| F02 | Course management | Allow teachers to create, update, and delete courses. | Must |
| F03 | Enrollment & roster management | Allow teachers to add or remove students from course rosters. | Must |
| F04 | Course material management | Allow teachers to post/delete course materials (announcements, text, links, files) and enrolled students to view/download them. | Must |
| F05 | Assignment & submission management | Allow teachers to create assignments with deadlines and enrolled students to submit their work. | Must |
| F06 | Grading & feedback | Allow teachers to grade submitted assignments and provide written feedback to students. | Should |
| F07 | Announcements & discussion channels | Provide course-level channels for class announcements and Q&A discussions between teachers and students. | Should |
| F08 | Notifications & reminders | Send in-app or email alerts for new materials, upcoming assignment deadlines, and graded work. | Could |
| F09 | Profile customization | Allow users to customize their profile details (display name, bio, avatar). | Could |
| F10 | Private in-app messaging | Real-time 1-on-1 private chat between students or teachers. | Won't |
| F11 | Payment gateway integration | Real-money course checkout, billing, and subscription management. | Won't |
| F12 | Live video conferencing | Built-in live video/audio streaming or virtual classroom calls. | Won't |

Out of scope:

- Real-time communication (F10, F12): Live video conferencing (e.g., Zoom/WebRTC integration) and real-time private 1-on-1 in-app chat.
- Complex institutional administrative integrations: Institution-wide user directory syncing (LDAP/SAML) and bulk administrative roster imports.
- Real-money payment gateway integration (F11): Commercial course checkout and payment processing.
