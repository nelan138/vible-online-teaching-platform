import type { FileRecord } from '#shared/types/FileRecord';

export async function getFileContents(courseId: string, contentId: string): Promise<FileRecord[]> {
   const [userId, headers] = await Promise.all([getUserId(), getAuthHeaders()]);
   if (!userId) throw new Error('Please sign in to continue.');

   return $fetch<FileRecord[]>(
      `/api/user/${encodeURIComponent(userId)}/teach/course/${encodeURIComponent(courseId)}/content/${encodeURIComponent(contentId)}/file`,
      { headers },
   );
}
