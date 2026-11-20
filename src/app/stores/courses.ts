import type { CourseRecord } from '#shared/types/CourseRecord';

export const useCoursesStore = defineStore('courses', () => {
   const courses = ref<CourseRecord[]>([]);
   let latestRequest: Promise<CourseRecord[]> | undefined;

   async function load(): Promise<CourseRecord[]> {
      const request = getCourses();
      latestRequest = request;
      const records = await request;

      if (request === latestRequest) courses.value = records;
      return records;
   }

   async function add(course: Parameters<typeof addCourse>[0]): Promise<void> {
      await addCourse(course);
      // The course was created even if refreshing the list fails.
      await load().catch(() => undefined);
   }

   if (import.meta.client) void load().catch(() => undefined);

   return { courses, load, add };
});
