export async function getAuthHeaders(): Promise<{ Authorization: string }> {
   const { headers } = await getUserIdAndAuthHeaders();
   return headers;
}

export async function getUserIdAndAuthHeaders(): Promise<{ userId: string; headers: { Authorization: string } }> {
   const auth = useAuth();
   const { data, error } = await auth.getSession();

   if (error) throw new Error(error.message || 'Could not verify your session.');
   if (!data?.user?.id || !data.session?.token) throw new Error('Please sign in to continue.');

   return {
      userId: data.user.id,
      headers: { Authorization: `Bearer ${data.session.token}` },
   };
}
