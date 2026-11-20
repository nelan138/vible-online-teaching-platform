export async function getAuthHeaders(): Promise<{ Authorization: string }> {
   const auth = useAuth();
   const { data, error } = await auth.getSession();

   if (error) throw new Error(error.message || 'Could not verify your session.');
   if (!data?.user || !data.session?.token) throw new Error('Please sign in to continue.');

   return { Authorization: `Bearer ${data.session.token}` };
}
