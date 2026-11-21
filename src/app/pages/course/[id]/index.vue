<template>
   <UContainer>
      <PageSection :title="courseName" />

      <input ref="fileInput" type="file" accept=".pdf,image/*,.zip" multiple hidden @change="attachFiles" />

      <PageSection
         v-for="content in contents"
         :key="content.id"
         collapsible
         :title="content.title"
         :description="content.description ?? undefined"
      >
         <template #header-actions>
            <UButton
               icon="lucide:file-up"
               label="Attach files"
               variant="ghost"
               :loading="uploadingContentIds.has(content.id)"
               @click="openFilePicker(content.id)"
            />

            <UButton icon="lucide:ellipsis-vertical" variant="ghost" />
         </template>

         <PageCardList>
            <UButton
               v-for="file in filesByContentId[content.id] ?? []"
               :key="file.id"
               class="px-0 py-4"
               as="li"
               icon="lucide:file"
               :label="file.name"
               variant="link"
            />
         </PageCardList>
      </PageSection>
   </UContainer>
</template>

<script setup lang="ts">
definePageMeta({
   layout: 'app',
   middleware: 'authenticate-user',
   showCourseSidebar: true,
});

const route = useRoute();
const courseId = route.params.id as string;
const contentsStore = useContentsStore();
const fileContentsStore = useFileContentsStore();
const toast = useToast();

/* *** */

const courseName = ref<string>();

const { contents } = storeToRefs(contentsStore);
const { filesByContentId } = storeToRefs(fileContentsStore);
const fileInput = useTemplateRef<HTMLInputElement>('fileInput');
const uploadingContentIds = reactive(new Set<string>());
let filePickerContentId: string | undefined;

onMounted(async () => {
   const records = await contentsStore.getContents(courseId);
   const fileLoads = Promise.allSettled(
      records.map((content) => fileContentsStore.getFileContents(courseId, content.id))
   );
   courseName.value = await getCourseNameByCourseId(courseId);
   await fileLoads;
});

function openFilePicker(contentId: string) {
   filePickerContentId = contentId;
   fileInput.value?.click();
}

async function attachFiles(event: Event) {
   const input = event.currentTarget as HTMLInputElement | null;
   const contentId = filePickerContentId;
   if (!input || !contentId) return;

   const files = Array.from(input.files ?? []);
   input.value = '';
   filePickerContentId = undefined;
   if (!files.length) return;

   uploadingContentIds.add(contentId);
   const failedFiles: string[] = [];
   for (const file of files) {
      const [, error] = await tryCatch(fileContentsStore.addFileContent({ courseId, contentId, file }));
      if (error) failedFiles.push(file.name);
   }
   uploadingContentIds.delete(contentId);

   if (failedFiles.length) {
      toast.add({
         title: 'Could not attach files',
         description: failedFiles.join(', '),
         color: 'error',
      });
   }
}
</script>

<style scoped></style>
