import selectPendingEnrollmentsByCourseId from '#server/sql/enrollment/selectPendingEnrollmentsByCourseId.sql';

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default defineEventHandler(async (event): Promise<EnrollmentRecord[]> => {
   const teacherId = await requireUserId(event);
   const requestedUserId = getRouterParam(event, 'userId');
   const courseId = getRouterParam(event, 'courseId');

   if (!requestedUserId || !uuidPattern.test(requestedUserId)) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid user ID' });
   }

   if (requestedUserId.toLowerCase() !== teacherId) {
      throw createError({ statusCode: 403, statusMessage: 'You cannot access enrollments for another user' });
   }

   if (!courseId || !uuidPattern.test(courseId)) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid course ID' });
   }

   const [result, error] = await tryCatch(
      Promise.resolve().then(() => useDatabase().query<EnrollmentRecord>(
         selectPendingEnrollmentsByCourseId, [courseId, teacherId]
      ))
   );

   if (error) {
      throw createError({ statusCode: 503, statusMessage: 'Could not load pending enrollments' });
   }

   return result.rows;
});
