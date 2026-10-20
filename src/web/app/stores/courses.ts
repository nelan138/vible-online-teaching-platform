import { defineStore } from "pinia";

export type Course = {
   id: number;
   title: string;
   teachers: string;
};

export const useCoursesStore = defineStore("courses", () => {
   const courses = ref<Course[]>([
      {
         id: 1,
         title: "Course A",
         teachers: "Teacher A",
      },
      {
         id: 2,
         title: "Course B",
         teachers: "Teacher B",
      },
      {
         id: 3,
         title: "Course C",
         teachers: "Teacher C",
      },
      {
         id: 4,
         title: "Course D",
         teachers: "Teacher D",
      },
      {
         id: 5,
         title: "Course E",
         teachers: "Teacher E",
      },
   ]);

   return {
      courses,
   };
});
