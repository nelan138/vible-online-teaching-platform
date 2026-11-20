export async function getUserId(): Promise<string | null> {
   return (await getSessionUser())?.id ?? null;
}
