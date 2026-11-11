import insertUser from '../../sql/insert_user.sql';

export default defineEventHandler(async (event) => {
   const body = await readBody<{ account_id?: unknown }>(event);

   if (typeof body?.account_id !== 'string' || !body.account_id.trim()) {
      throw createError({ statusCode: 400, statusMessage: 'Account ID is required' });
   }

   const db = useDatabase();
   const { rows } = await db.query(insertUser, [body.account_id.trim()]);

   if (!rows[0]) {
      throw createError({ statusCode: 409, statusMessage: 'User already exists for this account' });
   }

   setResponseStatus(event, 201);
   return rows[0];
});
