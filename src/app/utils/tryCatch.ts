export async function tryCatch<T>(
   promise: Promise<T>,
): Promise<[T, null] | [null, Error]> {
   try {
      const data = await promise;
      return [data, null];
   } catch (error) {
      const safeError =
         error instanceof Error ? error : new Error(String(error));
      return [null, safeError];
   }
}
