import type { UserRecord } from '#shared/types/UserRecord';

export async function getUserNameByUserId(userId: string): Promise<string> {
   const user = await $fetch<UserRecord | null>(`/api/user/${encodeURIComponent(userId)}`, {
      headers: await getAuthHeaders(),
   });

   if (!user?.name?.trim()) throw new Error('Could not determine the user name.');

   return user.name;
}
