export async function getUser(): Promise<UserRecord | null> {
   const auth = useAuth();
   const { data, error } = await auth.getSession();

   if (error) throw new Error(error.message || 'Could not verify your session.');
   if (!data?.user) return null;

   const token = data.session?.token;
   if (!token) throw new Error('Please sign in to continue.');

   const id = data.user.id;
   const user = await $fetch<UserRecord | null>(`/api/user/${encodeURIComponent(id)}`, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 15_000,
      retry: false,
   });

   return user?.id === id.toLowerCase() ? user : null;
}
