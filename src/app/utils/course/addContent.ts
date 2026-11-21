type AddContentInput = Pick<ContentRecord, 'courseId' | 'title'> &
   Partial<Pick<ContentRecord, 'description'>>;

export async function addContent({ courseId, title, description }: AddContentInput): Promise<ContentRecord> {
   const { userId, headers } = await getUserIdAndAuthHeaders();

   return $fetch<ContentRecord>(
      `/api/user/${encodeURIComponent(userId)}/teach/course/${encodeURIComponent(courseId)}/content`,
      {
         method: 'POST',
         headers,
         body: { title, description },
      },
   );
}
