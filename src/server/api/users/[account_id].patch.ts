/**
 $fetch('/api/users/[account_id]', {
   method: 'PATCH',
   body: {
      <user_role>
   },
})
 */

import updateUserRole from '../../sql/update_user_role.sql';

export default defineEventHandler(async (event) => {
   const accountId = getRouterParam(event, 'account_id');
   const body = await readBody<{ user_role?: unknown }>(event);

   if (!accountId) {
      throw createError({ statusCode: 400, statusMessage: 'Account ID is required' });
   }

   if (body?.user_role !== 'student' && body?.user_role !== 'teacher') {
      throw createError({ statusCode: 400, statusMessage: 'Role must be student or teacher' });
   }

   const { rows } = await useDatabase().query(updateUserRole, [accountId, body.user_role]);

   if (!rows[0]) {
      throw createError({ statusCode: 404, statusMessage: 'User not found' });
   }

   return rows[0];
});
