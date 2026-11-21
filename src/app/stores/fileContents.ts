import type { FileRecord } from '#shared/types/FileRecord';
import { addFileContent as uploadFileContent } from '~/utils/course/addFileContent';

export const useFileContentsStore = defineStore('fileContents', () => {
   const filesByContentId = ref<Partial<Record<string, FileRecord[]>>>({});
   const latestRequests = new Map<string, Promise<FileRecord[]>>();

   async function load(courseId: string, contentId: string): Promise<FileRecord[]> {
      const normalizedContentId = contentId.toLowerCase();
      const request = getFileContents(courseId, contentId);
      latestRequests.set(normalizedContentId, request);

      try {
         const files = await request;
         if (latestRequests.get(normalizedContentId) === request) {
            filesByContentId.value[normalizedContentId] = files;
         }
         return files;
      } finally {
         if (latestRequests.get(normalizedContentId) === request) {
            latestRequests.delete(normalizedContentId);
         }
      }
   }

   async function addFileContent(input: Parameters<typeof uploadFileContent>[0]): Promise<FileRecord> {
      const contentId = input.contentId.toLowerCase();
      const file = await uploadFileContent(input);

      // A list requested before the upload finished may not include the new file.
      await latestRequests.get(contentId)?.catch(() => undefined);
      const files = filesByContentId.value[contentId] ?? [];
      if (!files.some(item => item.id === file.id)) {
         filesByContentId.value[contentId] = [...files, file].sort(
            (first, second) => first.name.localeCompare(second.name) || first.id.localeCompare(second.id)
         );
      }

      return file;
   }

   return { filesByContentId, load, addFileContent };
});
