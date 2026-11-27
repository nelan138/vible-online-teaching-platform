import { courses } from "~/data/temp/courses";

export const useTeacherCoursesStore = defineStore("teacher-courses", {
   state: () => ({
      courses: [] as Course[],
   }),
   actions: {
      loadCourses(teacherId: string) {
         this.courses = courses.filter(
            (course) => course.teacherId === teacherId,
         );
      },

      addCourse(course: Course) {
         if (courses.some((item) => item.id === course.id)) {
            throw new Error(`Course ID already exists: ${course.id}`);
         }
         courses.push(course);
         this.courses.push(course);
      },
   },
});
