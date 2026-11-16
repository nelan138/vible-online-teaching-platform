export async function userSetupIsComplete(): Promise<boolean> {
   const auth = useAuth();
   const { data: session, error } = await auth.getSession();

   if (error) throw new Error(error.message || 'Could not verify your session.');
   if (!session?.user) return false;

   const [user, userError] = await tryCatch(
      $fetch<UserRecord | null>(`/api/user/${encodeURIComponent(session.user.id)}`, {
         headers: await getAuthHeaders(),
      })
   );

   if (userError) throw userError;

   return Boolean(
      user &&
      user.id === session.user.id &&
      typeof user.name === 'string' &&
      user.name.trim().length > 0 &&
      (user.role === 'student' || user.role === 'teacher')
   );
}
