import selectCoursesByTeacherId from '#server/sql/course/selectCoursesByTeacherId.sql';
import { useDatabase } from '#server/utils/db';
import type { CourseRecord } from '#shared/types/CourseRecord';
import { tryCatch } from '#shared/utils/tryCatch';

export default defineEventHandler(async (event): Promise<CourseRecord[]> => {
   const userId = await requireUserId(event);
   const requestedUserId = getRouterParam(event, 'userId');

   if (!requestedUserId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(requestedUserId)) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid user ID' });
   }

   if (requestedUserId.toLowerCase() !== userId) {
      throw createError({ statusCode: 403, statusMessage: 'You cannot access courses for another user' });
   }

   const [result, error] = await tryCatch(
      Promise.resolve().then(() => useDatabase().query<CourseRecord>(selectCoursesByTeacherId, [userId]))
   );

   if (error) {
      throw createError({ statusCode: 503, statusMessage: 'Could not load courses' });
   }

   return result.rows;
});
