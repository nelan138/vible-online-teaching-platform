/**
 $fetch('/api/users/[account_id]', {
   method: 'GET',
   body: {
      <account_id: string>
   },
})
 */

import selectUserWhereAccountId from '../../sql/select_user_where_account_id.sql';

export default defineEventHandler(async (event) => {
   const db = useDatabase();

   const accountId = getRouterParam(event, 'account_id');

   if (!accountId) throw createError({ statusCode: 400, statusMessage: 'Account ID is required' });

   const { rows } = await db.query(selectUserWhereAccountId, [accountId]);

   return Response.json(rows[0] ?? null);
});
