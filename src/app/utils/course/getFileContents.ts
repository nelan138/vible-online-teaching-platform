export async function getFileContents(courseId: string, contentId: string): Promise<FileRecord[]> {
   const { userId, headers } = await getUserIdAndAuthHeaders();

   return $fetch<FileRecord[]>(
      `/api/user/${encodeURIComponent(userId)}/teach/course/${encodeURIComponent(courseId)}/content/${encodeURIComponent(contentId)}/file`,
      { headers },
   );
}
