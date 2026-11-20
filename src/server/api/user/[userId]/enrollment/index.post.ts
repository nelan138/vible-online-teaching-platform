import insertEnrollment from '#server/sql/enrollment/insertEnrollment.sql';
import selectUserWhereId from '#server/sql/user/selectUserWhereId.sql';
import { useDatabase } from '#server/utils/db';
import type { CourseRecord } from '#shared/types/CourseRecord';
import type { UserRecord } from '#shared/types/UserRecord';
import { tryCatch } from '#shared/utils/tryCatch';

export default defineEventHandler(async (event) => {
   const studentId = await requireUserId(event);
   const requestedUserId = getRouterParam(event, 'userId');

   if (!requestedUserId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(requestedUserId)) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid user ID' });
   }

   if (requestedUserId.toLowerCase() !== studentId) {
      throw createError({ statusCode: 403, statusMessage: 'You cannot enroll another user' });
   }

   const body = await readBody<Partial<Pick<CourseRecord, 'inviteCode'>> | null>(event);
   const inviteCode = typeof body?.inviteCode === 'string' ? body.inviteCode.trim() : '';

   if (!inviteCode || [...inviteCode].length > 8) {
      throw createError({ statusCode: 400, statusMessage: 'Invite code must be 1 to 8 characters' });
   }

   const [profile, profileError] = await tryCatch(
      Promise.resolve().then(() => useDatabase().query<UserRecord>(selectUserWhereId, [studentId]))
   );

   if (profileError) {
      throw createError({ statusCode: 503, statusMessage: 'Could not verify student role' });
   }
   if (profile.rows[0]?.role !== 'student') {
      throw createError({ statusCode: 403, statusMessage: 'Only students can request enrollment' });
   }

   const [result, error] = await tryCatch(useDatabase().query(insertEnrollment, [studentId, inviteCode]));

   if (error) {
      if ('code' in error && error.code === '23505' && 'constraint' in error && error.constraint === 'enrollment_pkey') {
         throw createError({ statusCode: 409, statusMessage: 'Enrollment already exists for this course' });
      }
      throw createError({ statusCode: 503, statusMessage: 'Could not create enrollment' });
   }

   if (result.rowCount === 0) {
      throw createError({ statusCode: 404, statusMessage: 'Invite code not found' });
   }

   return sendNoContent(event, 201);
});
