import selectUserRole from '../../../sql/select_user_role_where_account_id.sql';

export default defineEventHandler(async (event) => {
   const accountId = getRouterParam(event, 'account_id');

   if (!accountId) {
      throw createError({ statusCode: 400, statusMessage: 'Account ID is required' });
   }

   const db = useDatabase();
   const { rows } = await db.query(selectUserRole, [accountId]);

   return Response.json(rows[0]?.user_role ?? null);
});
