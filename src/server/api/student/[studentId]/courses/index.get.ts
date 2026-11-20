import selectCoursesWhereStudentId from '#server/sql/course/selectCoursesWhereStudentId.sql';
import { useDatabase } from '#server/utils/db';
import type { CourseRecord } from '#shared/types/CourseRecord';
import { tryCatch } from '#shared/utils/tryCatch';

type StudentCourseRecord = Omit<CourseRecord, 'inviteCode'>;

export default defineEventHandler(async (event): Promise<StudentCourseRecord[]> => {
   const studentId = await requireUserId(event);
   const requestedStudentId = getRouterParam(event, 'studentId');

   if (!requestedStudentId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(requestedStudentId)) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid student ID' });
   }

   if (requestedStudentId.toLowerCase() !== studentId) {
      throw createError({ statusCode: 403, statusMessage: 'You cannot access courses for another user' });
   }

   const [result, error] = await tryCatch(
      Promise.resolve().then(() => useDatabase().query<StudentCourseRecord>(selectCoursesWhereStudentId, [studentId]))
   );

   if (error) {
      throw createError({ statusCode: 503, statusMessage: 'Could not load courses' });
   }

   return result.rows;
});
