### Actors

| **Actor** | **Description**                                                                                                                           |
|-----------|-------------------------------------------------------------------------------------------------------------------------------------------|
| Teachers  | Creates and manages courses, materials, participants, assignments, and announcements; grades submissions and participates in discussions. |
| Students  | Joins courses, accesses materials and announcements, submits assignments, views grades and feedback, and participates in discussions.     |

### Use Case List

| **ID** | **Use case**                | **Primary actor** | **Priority** | **Related FR**         |
|--------|-----------------------------|-------------------|--------------|------------------------|
| UC-01  | Create an account           | Student / Teacher | Must         | FR-01A                 |
| UC-02  | Log in                      | Student / Teacher | Must         | FR-01B                 |
| UC-03  | View courses                | Student / Teacher | Must         | FR-02A, FR-02B, FR-03C |
| UC-04  | Manage courses              | Teacher           | Must         | FR-02A, FR-02B         |
| UC-05  | Manage course materials     | Teacher           | Must         | FR-04A                 |
| UC-06  | Join a course               | Student           | Must         | FR-03C                 |
| UC-07  | View course materials       | Student           | Must         | FR-04B                 |
| UC-08  | View course participants    | Teacher / Student | Must         | FR-03A, FR-03B, FR-03C |
| UC-09  | Share invite code           | Teacher / Student | Must         | FR-03A, FR-03C         |
| UC-10  | Manage course participants  | Teacher           | Must         | FR-03A, FR-03B         |
| UC-11  | View course assignments     | Teacher / Student | Must         | FR-05A, FR-05B         |
| UC-12  | Manage course assignments   | Teacher           | Must         | FR-05A                 |
| UC-13  | Submit an assignment        | Student           | Must         | FR-05B, FR-05C         |
| UC-14  | Grade assignments           | Teacher           | Should       | FR-06A                 |
| UC-15  | Manage course announcements | Teacher           | Should       | FR-07A                 |
| UC-16  | Exchange course messages    | Teacher / Student | Should       | FR-07B                 |
| UC-17  | Manage profile              | Student / Teacher | Could        | FR-09A                 |
| UC-18  | View notifications          | Student / Teacher | Could        | FR-08A                 |
| UC-19  | View course announcements   | Student / Teacher | Could        | FR-07A                 |
