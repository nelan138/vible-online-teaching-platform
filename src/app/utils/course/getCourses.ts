import type { CourseRecord } from '#shared/types/CourseRecord';

export async function getCourses(): Promise<CourseRecord[]> {
   const [userId, headers] = await Promise.all([getUserId(), getAuthHeaders()]);
   if (!userId) throw new Error('Please sign in to continue.');

   return $fetch<CourseRecord[]>(`/api/user/${encodeURIComponent(userId)}/teach/course`, { headers });
}
