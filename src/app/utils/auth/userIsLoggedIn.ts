export async function userIsLoggedIn(): Promise<boolean> {
   return Boolean(await getSessionUser());
}
