import type { ContentRecord } from '#shared/types/ContentRecord';

export async function getContents(courseId: string): Promise<ContentRecord[]> {
   const [userId, headers] = await Promise.all([getUserId(), getAuthHeaders()]);
   if (!userId) throw new Error('Please sign in to continue.');

   return $fetch<ContentRecord[]>(
      `/api/user/${encodeURIComponent(userId)}/teach/course/${encodeURIComponent(courseId)}/content`,
      { headers },
   );
}
