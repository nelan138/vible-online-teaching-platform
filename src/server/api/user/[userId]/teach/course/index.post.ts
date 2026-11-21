import { randomUUID } from 'node:crypto';
import insertCourse from '#server/sql/course/insertCourse.sql';
import selectUserByUserId from '#server/sql/user/selectUserByUserId.sql';
import { useDatabase } from '#server/utils/db';
import { generateInviteCode } from '#server/utils/generateInviteCode';
import type { CourseRecord } from '#shared/types/CourseRecord';
import type { UserRecord } from '#shared/types/UserRecord';
import { tryCatch } from '#shared/utils/tryCatch';

export default defineEventHandler(async (event) => {
   const teacherId = await requireUserId(event);
   const requestedUserId = getRouterParam(event, 'userId');

   if (!requestedUserId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(requestedUserId)) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid user ID' });
   }

   if (requestedUserId.toLowerCase() !== teacherId) {
      throw createError({ statusCode: 403, statusMessage: 'You cannot create a course for another user' });
   }

   const body = await readBody<Partial<Pick<CourseRecord, 'name'>> | null>(event);
   const name = typeof body?.name === 'string' ? body.name.trim() : '';

   if (!name) throw createError({ statusCode: 400, statusMessage: 'Course name is required' });

   const [profile, profileError] = await tryCatch(
      Promise.resolve().then(() => useDatabase().query<UserRecord>(selectUserByUserId, [teacherId]))
   );

   if (profileError) {
      throw createError({ statusCode: 503, statusMessage: 'Could not verify teacher role' });
   }
   if (profile.rows[0]?.role !== 'teacher') {
      throw createError({ statusCode: 403, statusMessage: 'Only teachers can create courses' });
   }

   const courseId = randomUUID();
   for (let attempt = 0; attempt < 3; attempt++) {
      const inviteCode = generateInviteCode();
      const [result, error] = await tryCatch(
         useDatabase().query(insertCourse, [courseId, name, teacherId, inviteCode])
      );

      if (!error && result.rowCount === 1) return sendNoContent(event, 201);

      const inviteCodeConflict = error && 'code' in error && error.code === '23505' &&
         'constraint' in error && error.constraint === 'course_inviteCode_key';
      if (!inviteCodeConflict) break;
   }

   throw createError({ statusCode: 503, statusMessage: 'Could not create course' });
});
