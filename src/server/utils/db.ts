import { Pool } from "pg";

let pool: Pool | undefined;

export function useDatabase() {
   if (!pool) {
      const connectionString = process.env.DATABASE_URL;

      if (!connectionString) {
         throw new Error("DATABASE_URL must be configured on the server.");
      }

      pool = new Pool({
         connectionString,
         max: 5,
         connectionTimeoutMillis: 10_000,
         idleTimeoutMillis: 30_000,
      });
      pool.on("error", () => {
         console.error("An idle PostgreSQL connection failed.");
      });
   }

   return pool;
}
