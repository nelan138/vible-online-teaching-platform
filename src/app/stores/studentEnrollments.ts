import { enrollments } from "~/data/temp/enrollments";

export const useStudentEnrollmentsStore = defineStore("student-enrollments", {
   state: () => ({
      enrollments: [] as Enrollment[],
   }),
   actions: {
      loadEnrollments(studentId: string) {
         this.enrollments = enrollments.filter(
            (enrollment) => enrollment.studentId === studentId,
         );
      },
   },
});
