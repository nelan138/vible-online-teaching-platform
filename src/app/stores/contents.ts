import { addContent as addCourseContent } from '~/utils/course/addContent';

export const useContentsStore = defineStore('contents', () => {
   const contents = ref<ContentRecord[]>([]);
   let activeCourseId: string | undefined;
   let latestRequest: Promise<ContentRecord[]> | undefined;

   async function getContents(courseId: string): Promise<ContentRecord[]> {
      const normalizedCourseId = courseId.toLowerCase();
      if (activeCourseId !== normalizedCourseId) {
         activeCourseId = normalizedCourseId;
         contents.value = [];
      }

      const request = getContentsByCourseId(courseId);
      latestRequest = request;
      const records = await request;

      if (request === latestRequest) contents.value = records;
      return records;
   }

   async function addContent(input: Parameters<typeof addCourseContent>[0]): Promise<void> {
      const record = await addCourseContent(input);
      const courseId = record.courseId.toLowerCase();
      activeCourseId ??= courseId;
      if (activeCourseId !== courseId) return;

      // Apply the saved record after an in-flight load so its response cannot replace it.
      if (latestRequest) await tryCatch(latestRequest);
      if (activeCourseId !== courseId || contents.value.some(item => item.id === record.id)) return;

      contents.value = [record, ...contents.value]
         .sort((first, second) => second.createdAt.localeCompare(first.createdAt));
   }

   return { contents, getContents, addContent };
});
