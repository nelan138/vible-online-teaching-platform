export async function addCourse({ name }: Pick<CourseRecord, 'name'>): Promise<void> {
   const { userId, headers } = await getUserIdAndAuthHeaders();

   await $fetch(`/api/user/${encodeURIComponent(userId)}/teach/course`, {
      method: 'POST',
      headers,
      body: { name },
   });
}
