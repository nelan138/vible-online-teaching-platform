import type { UserRecord } from '#shared/types/UserRecord';
import { tryCatch } from '#shared/utils/tryCatch';
import selectUserWhereId from '../../../sql/user/selectUserWhereId.sql';
import { useDatabase } from '../../../utils/db';

export default defineEventHandler(async (event): Promise<UserRecord | null> => {
   const userId = await requireUserId(event);
   const requestedUserId = getRouterParam(event, 'userId');

   if (!requestedUserId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(requestedUserId)) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid user ID' });
   }

   if (requestedUserId.toLowerCase() !== userId) {
      throw createError({ statusCode: 403, statusMessage: 'You cannot access another user profile' });
   }

   const [result, error] = await tryCatch(
      Promise.resolve().then(() => useDatabase().query<UserRecord>(selectUserWhereId, [userId]))
   );

   if (error) {
      throw createError({ statusCode: 503, statusMessage: 'Could not load user' });
   }

   return result.rows[0] ?? null;
});
