export async function userIsLoggedIn(): Promise<boolean> {
   const auth = useAuth();
   const { data: session, error } = await auth.getSession();

   if (error) throw new Error(error.message || 'Could not verify your session.');

   return Boolean(session?.user);
}
