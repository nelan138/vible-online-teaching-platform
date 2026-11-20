export async function createUser(user: Pick<UserRecord, 'name' | 'role'>): Promise<UserRecord> {
   return $fetch<UserRecord>('/api/user', {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: { name: user.name, role: user.role },
   });
}
