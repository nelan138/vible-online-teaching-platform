import { useDatabase } from "../utils/db";

export default defineEventHandler(async () => {
   try {
      await useDatabase().query("SELECT 1");
      return { status: "ok", database: "connected" };
   } catch {
      throw createError({
         statusCode: 503,
         statusMessage: "Database unavailable",
      });
   }
});
