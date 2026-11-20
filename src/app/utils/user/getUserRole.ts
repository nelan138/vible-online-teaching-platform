export async function getUserRole(): Promise<UserRecord['role'] | null> {
   const auth = useAuth();
   const { data: session, error } = await auth.getSession();

   if (error) throw new Error(error.message || 'Could not verify your session.');
   if (!session?.user) return null;

   const [user, userError] = await tryCatch(
      $fetch<UserRecord | null>(`/api/user/${encodeURIComponent(session.user.id)}`, {
         headers: await getAuthHeaders(),
      })
   );

   if (userError) throw userError;
   if (!user || user.id !== session.user.id) return null;

   return user.role === 'student' || user.role === 'teacher' ? user.role : null;
}
