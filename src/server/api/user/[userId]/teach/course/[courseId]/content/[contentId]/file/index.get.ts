import selectFilesByContentId from '#server/sql/content/selectFilesByContentId.sql';

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default defineEventHandler(async (event): Promise<FileRecord[]> => {
   const teacherId = await requireUserId(event);
   const requestedUserId = getRouterParam(event, 'userId');
   const courseId = getRouterParam(event, 'courseId');
   const contentId = getRouterParam(event, 'contentId');

   if (!requestedUserId || !uuidPattern.test(requestedUserId)) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid user ID' });
   }

   if (requestedUserId.toLowerCase() !== teacherId) {
      throw createError({ statusCode: 403, statusMessage: 'You cannot access content files for another user' });
   }

   if (!courseId || !uuidPattern.test(courseId)) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid course ID' });
   }

   if (!contentId || !uuidPattern.test(contentId)) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid content ID' });
   }

   const [result, error] = await tryCatch(
      Promise.resolve().then(() => useDatabase().query<FileRecord | { id: null }>(
         selectFilesByContentId, [contentId, courseId, teacherId]
      ))
   );

   if (error) {
      throw createError({ statusCode: 503, statusMessage: 'Could not load content files' });
   }

   if (result.rows.length === 0) {
      throw createError({ statusCode: 404, statusMessage: 'Content not found' });
   }

   return result.rows.filter(row => row.id !== null);
});
