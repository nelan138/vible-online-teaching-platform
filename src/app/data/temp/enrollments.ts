import { courses } from "./courses";
import { student } from "./user";

const statuses: Enrollment["status"][] = ["pending", "rejected", "approved"];

export const enrollments: Enrollment[] = courses.map((course, index) => ({
   studentId: student.id,
   studentName: student.name,
   courseId: course.id,
   courseName: course.name,
   teacherId: course.teacherId,
   teacherName: course.teacherName,
   name: course.name,
   description: course.description,
   status: statuses[index] ?? "approved",
}));
