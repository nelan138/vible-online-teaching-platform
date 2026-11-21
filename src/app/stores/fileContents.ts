import { addFileContent as uploadFileContent } from '~/utils/course/addFileContent';
import { getFileContents as fetchFileContents } from '~/utils/course/getFileContents';

export const useFileContentsStore = defineStore('fileContents', () => {
   const filesByContentId = ref<Partial<Record<string, FileRecord[]>>>({});
   const latestRequests = new Map<string, Promise<FileRecord[]>>();

   async function getFileContents(courseId: string, contentId: string): Promise<FileRecord[]> {
      const normalizedContentId = contentId.toLowerCase();
      const request = fetchFileContents(courseId, contentId);
      latestRequests.set(normalizedContentId, request);

      const [files, error] = await tryCatch(request);
      if (latestRequests.get(normalizedContentId) === request) {
         latestRequests.delete(normalizedContentId);
         if (!error) filesByContentId.value[normalizedContentId] = files;
      }

      if (error) throw error;
      return files;
   }

   async function addFileContent(input: Parameters<typeof uploadFileContent>[0]): Promise<FileRecord> {
      const contentId = input.contentId.toLowerCase();
      const file = await uploadFileContent(input);

      // A list requested before the upload finished may not include the new file.
      const request = latestRequests.get(contentId);
      if (request) await tryCatch(request);
      const files = filesByContentId.value[contentId] ?? [];
      if (!files.some(item => item.id === file.id)) {
         filesByContentId.value[contentId] = [...files, file].sort(
            (first, second) => first.name.localeCompare(second.name) || first.id.localeCompare(second.id)
         );
      }

      return file;
   }

   return { filesByContentId, getFileContents, addFileContent };
});
