import { addCourse as createCourse } from '~/utils/course/addCourse';
import { getCourses as fetchCourses } from '~/utils/course/getCourses';

export const useCoursesStore = defineStore('courses', () => {
   const courses = ref<CourseRecord[]>([]);
   let latestRequest: Promise<CourseRecord[]> | undefined;

   async function getCourses(): Promise<CourseRecord[]> {
      const request = fetchCourses();
      latestRequest = request;
      const records = await request;

      if (request === latestRequest) courses.value = records;
      return records;
   }

   async function addCourse(course: Parameters<typeof createCourse>[0]): Promise<void> {
      await createCourse(course);
      // The course was created even if refreshing the list fails.
      await tryCatch(getCourses());
   }

   if (import.meta.client) void tryCatch(getCourses());

   return { courses, getCourses, addCourse };
});
