export async function getContentsByCourseId(courseId: string): Promise<ContentRecord[]> {
   const { userId, headers } = await getUserIdAndAuthHeaders();

   return $fetch<ContentRecord[]>(
      `/api/user/${encodeURIComponent(userId)}/teach/course/${encodeURIComponent(courseId)}/content`,
      { headers },
   );
}
