export async function getCourses(): Promise<CourseRecord[]> {
   const { userId, headers } = await getUserIdAndAuthHeaders();

   return $fetch<CourseRecord[]>(`/api/user/${encodeURIComponent(userId)}/teach/course`, { headers });
}
