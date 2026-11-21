import updateEnrollmentStatusByCourseIdAndStudentId from '#server/sql/enrollment/updateEnrollmentStatusByCourseIdAndStudentId.sql';
import { useDatabase } from '#server/utils/db';
import type { EnrollmentRecord } from '#shared/types/EnrollmentRecord';
import { tryCatch } from '#shared/utils/tryCatch';

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default defineEventHandler(async (event) => {
   const teacherId = await requireUserId(event);
   const requestedUserId = getRouterParam(event, 'userId');
   const courseId = getRouterParam(event, 'courseId');
   const studentId = getRouterParam(event, 'studentId');

   if (!requestedUserId || !uuidPattern.test(requestedUserId)) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid user ID' });
   }

   if (requestedUserId.toLowerCase() !== teacherId) {
      throw createError({ statusCode: 403, statusMessage: 'You cannot update enrollments for another user' });
   }

   if (!courseId || !uuidPattern.test(courseId)) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid course ID' });
   }

   if (!studentId || !uuidPattern.test(studentId)) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid student ID' });
   }

   const body = await readBody<Partial<Pick<EnrollmentRecord, 'status'>> | null>(event);
   const status = body?.status;
   if (status !== 'approved' && status !== 'rejected') {
      throw createError({ statusCode: 400, statusMessage: 'Status must be approved or rejected' });
   }

   const [result, error] = await tryCatch(
      Promise.resolve().then(() => useDatabase().query(
         updateEnrollmentStatusByCourseIdAndStudentId, [courseId, studentId, teacherId, status]
      ))
   );

   if (error) {
      throw createError({ statusCode: 503, statusMessage: 'Could not update enrollment' });
   }

   if (result.rowCount === 0) {
      throw createError({ statusCode: 404, statusMessage: 'Pending enrollment not found' });
   }

   return sendNoContent(event, 204);
});
