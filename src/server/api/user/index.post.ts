import insertUser from '../../sql/insertUser.sql';

export default defineEventHandler(async (event): Promise<UserRecord> => {
   const id = await requireUserId(event);
   const body = await readBody<Partial<Pick<UserRecord, 'name' | 'role'>> | null>(event);
   const name = body?.name;
   const role = body?.role;

   if (typeof name !== 'string' || !name.trim()) {
      throw createError({ statusCode: 400, statusMessage: 'Name is required' });
   }

   if (role !== 'student' && role !== 'teacher') {
      throw createError({ statusCode: 400, statusMessage: 'Invalid user role' });
   }

   const [result, error] = await tryCatch(
      Promise.resolve().then(() => useDatabase().query<UserRecord>(insertUser, [id, name.trim(), role]))
   );

   if (error) {
      const code = 'code' in error ? error.code : undefined;

      if (code === '23505') {
         throw createError({ statusCode: 409, statusMessage: 'User profile already exists' });
      }
      if (code === '23503') {
         throw createError({ statusCode: 400, statusMessage: 'Auth account does not exist' });
      }

      throw createError({ statusCode: 503, statusMessage: 'Could not create user' });
   }

   const user = result.rows[0];
   if (!user) throw createError({ statusCode: 503, statusMessage: 'Could not create user' });

   setResponseStatus(event, 201);
   return user;
});
