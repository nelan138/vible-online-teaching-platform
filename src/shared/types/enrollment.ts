export type Enrollment = {
   studentId: string; // uuid
   studentName: string;

   courseId: string; // uuid
   courseName: string;

   teacherId: string;
   teacherName: string;

   name: string;
   description: string;
   status: "pending" | "approved" | "rejected";
};
