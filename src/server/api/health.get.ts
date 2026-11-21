export default defineEventHandler(async () => {
   const [, error] = await tryCatch(Promise.resolve().then(() => useDatabase().query("SELECT 1")));
   if (error) {
      throw createError({
         statusCode: 503,
         statusMessage: "Database unavailable",
      });
   }

   return { status: "ok", database: "connected" };
});
