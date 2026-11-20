import type { CourseRecord } from '#shared/types/CourseRecord';

export async function createCourse({
   name,
   description,
}: Pick<CourseRecord, 'name'> & Partial<Pick<CourseRecord, 'description'>>): Promise<void> {
   const [userId, headers] = await Promise.all([getUserId(), getAuthHeaders()]);
   if (!userId) throw new Error('Please sign in to continue.');

   await $fetch(`/api/user/${encodeURIComponent(userId)}/teach/course`, {
      method: 'POST',
      headers,
      body: { name, description: description ?? null },
   });
}
