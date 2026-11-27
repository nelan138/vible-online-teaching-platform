import { courses } from "~/data/temp/courses";

export const useCourseContentsStore = defineStore("course-contents", {
   state: () => ({
      contents: [] as Content[],
   }),
   actions: {
      loadCourses(teacherId: string) {
         this.courses = courses.filter(
            (course) => course.teacherId === teacherId,
         );
      },

      addCourse(course: Course) {
         if (this.courses.some((item) => item.id === course.id)) {
            throw new Error(`Course ID already exists: ${course.id}`);
         }
         this.courses.push(course);
      },
   },
});
