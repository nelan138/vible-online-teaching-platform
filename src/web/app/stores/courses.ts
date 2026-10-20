import { defineStore } from "pinia";

export type Course = {
   id: number;
   title: string;
   teacher: string;
};

export const useCoursesStore = defineStore("courses", () => {
   const courses = ref<Course[]>([
      {
         id: 1,
         title: "Course A",
         teacher: "Teacher A",
      },
      {
         id: 2,
         title: "Course B",
         teacher: "Teacher B",
      },
      {
         id: 3,
         title: "Course C",
         teacher: "Teacher C",
      },
      {
         id: 4,
         title: "Course D",
         teacher: "Teacher D",
      },
      {
         id: 5,
         title: "Course E",
         teacher: "Teacher E",
      },
   ]);

   return {
      courses,
   };
});
