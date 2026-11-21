import type { FileRecord } from '#shared/types/FileRecord';

export async function addFileContent(
   { courseId, contentId, file }: { courseId: string; contentId: string; file: File },
): Promise<FileRecord> {
   const [userId, headers] = await Promise.all([getUserId(), getAuthHeaders()]);
   if (!userId) throw new Error('Please sign in to continue.');

   const body = new FormData();
   body.append('file', file);

   return $fetch<FileRecord>(
      `/api/user/${encodeURIComponent(userId)}/teach/course/${encodeURIComponent(courseId)}/content/${encodeURIComponent(contentId)}/file`,
      { method: 'POST', headers, body },
   );
}
