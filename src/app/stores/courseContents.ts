import { contents } from "~/data/temp/contents";

export const useCourseContentsStore = defineStore("course-contents", {
   state: () => ({
      contents: [] as Content[],
      courseId: null as string | null,
   }),
   actions: {
      loadContents(courseId: string) {
         this.courseId = courseId;
         this.contents = contents.filter((item) => item.courseId === courseId);
      },

      addContent(content: Content) {
         if (contents.some((item) => item.id === content.id)) {
            throw new Error(`Content ID already exists: ${content.id}`);
         }
         contents.push(content);
         if (this.courseId === content.courseId) {
            this.contents.push(content);
         }
      },
   },
});
