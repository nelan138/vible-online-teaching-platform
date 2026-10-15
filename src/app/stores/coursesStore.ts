import { defineStore } from 'pinia';

export type Course = {
   id: number;
   name: string;
   description: string;
};

const placeHolderCourses = [
   { id: 0, name: 'Course 1', description: 'Description for Course 1' },
   { id: 1, name: 'Course 2', description: 'Description for Course 2' },
   { id: 2, name: 'Course 3', description: 'Description for Course 3' },
] as Course[];

export const useCoursesStore = defineStore('courses', {
   state: () => ({
      courses: [] as Course[],
      isLoading: false,
      isLoaded: false,
   }),

   getters: {},

   actions: {
      async load(): Promise<void> {
         if (this.isLoading || this.isLoaded) return;

         this.isLoaded = false;
         this.isLoading = true;

         this.courses = placeHolderCourses;

         this.isLoaded = true;
         this.isLoading = false;
      },

      async getCourseById(id: number): Promise<Course> {
         const course = this.courses.find((c) => c.id === id);

         if (!course) {
            throw new Error('Course not found!');
         }

         return course;
      },
   },
});
