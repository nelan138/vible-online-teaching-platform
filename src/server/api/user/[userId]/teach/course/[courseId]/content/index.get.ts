import selectContentsByCourseId from '#server/sql/content/selectContentsByCourseId.sql';
import { useDatabase } from '#server/utils/db';
import type { ContentRecord } from '#shared/types/ContentRecord';
import { tryCatch } from '#shared/utils/tryCatch';

type ContentRow = Omit<ContentRecord, 'createdAt'> & { createdAt: Date };
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default defineEventHandler(async (event): Promise<ContentRecord[]> => {
   const teacherId = await requireUserId(event);
   const requestedUserId = getRouterParam(event, 'userId');
   const courseId = getRouterParam(event, 'courseId');

   if (!requestedUserId || !uuidPattern.test(requestedUserId)) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid user ID' });
   }

   if (requestedUserId.toLowerCase() !== teacherId) {
      throw createError({ statusCode: 403, statusMessage: 'You cannot access course content for another user' });
   }

   if (!courseId || !uuidPattern.test(courseId)) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid course ID' });
   }

   const [result, error] = await tryCatch(
      Promise.resolve().then(() => useDatabase().query<ContentRow | { id: null }>(
         selectContentsByCourseId, [courseId, teacherId]
      ))
   );

   if (error) {
      throw createError({ statusCode: 503, statusMessage: 'Could not load course content' });
   }

   if (result.rows.length === 0) {
      throw createError({ statusCode: 404, statusMessage: 'Course not found' });
   }

   return result.rows
      .filter(row => row.id !== null)
      .map(row => ({ ...row, createdAt: row.createdAt.toISOString() }));
});
