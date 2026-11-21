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

      <FloatingPanel>
         <UButton icon="lucide:plus" label="Add content" aria-haspopup="dialog" @click="openAddContentModal" />

         <UButton icon="lucide:link" label="Invite people" />

         <UButton icon="lucide:square-arrow-left-exit" label="Log out" loading-auto color="warning" @click="logOut" />
      </FloatingPanel>

      <UModal
         v-model:open="addContentOpen"
         title="Add content"
         :close="{ disabled: savingContent }"
         :dismissible="!savingContent"
      >
         <template #body>
            <UForm
               :state="contentForm"
               :validate="validateContent"
               :disabled="savingContent"
               class="space-y-4"
               @submit="submitContent"
            >
               <UFormField label="Title" name="title" required>
                  <UInput v-model="contentForm.title" class="w-full" />
               </UFormField>

               <UFormField label="Description" name="description" hint="Optional">
                  <UTextarea v-model="contentForm.description" :rows="4" class="w-full" />
               </UFormField>

               <p v-if="contentSaveFailed" role="alert" class="text-sm text-error">
                  Could not add the content. Please try again.
               </p>

               <div class="flex justify-end gap-2">
                  <UButton
                     type="button"
                     label="Cancel"
                     color="neutral"
                     variant="outline"
                     :disabled="savingContent"
                     @click="addContentOpen = false"
                  />

                  <UButton type="submit" label="Add content" :loading="savingContent" />
               </div>
            </UForm>
         </template>
      </UModal>
   </UContainer>
</template>

<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '@nuxt/ui';

definePageMeta({
   layout: 'course',
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
const addContentOpen = ref(false);
const contentForm = reactive({ title: '', description: '' });
const savingContent = ref(false);
const contentSaveFailed = ref(false);

onMounted(async () => {
   const records = await contentsStore.load(courseId);
   const fileLoads = Promise.allSettled(records.map((content) => fileContentsStore.load(courseId, content.id)));
   courseName.value = await getCourseNameByCourseId(courseId);
   await fileLoads;
});

function attachFile(contentId: string, file: File) {
   return fileContentsStore.addFileContent({ courseId, contentId, file });
}

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
   try {
      const failedFiles: string[] = [];
      for (const file of files) {
         const [, error] = await tryCatch(attachFile(contentId, file));
         if (error) failedFiles.push(file.name);
      }

      if (failedFiles.length) {
         toast.add({
            title: 'Could not attach files',
            description: failedFiles.join(', '),
            color: 'error',
         });
      }
   } finally {
      uploadingContentIds.delete(contentId);
   }
}

function openAddContentModal() {
   contentForm.title = '';
   contentForm.description = '';
   contentSaveFailed.value = false;
   addContentOpen.value = true;
}

function validateContent(data: typeof contentForm): FormError[] {
   return data.title.trim() ? [] : [{ name: 'title', message: 'Enter a title.' }];
}

async function submitContent({ data }: FormSubmitEvent<typeof contentForm>) {
   if (savingContent.value) return;

   savingContent.value = true;
   contentSaveFailed.value = false;
   const [, error] = await tryCatch(
      contentsStore.addContent({
         courseId,
         title: data.title.trim(),
         description: data.description.trim() ? data.description : null,
      })
   );
   savingContent.value = false;

   if (error) contentSaveFailed.value = true;
   else addContentOpen.value = false;
}
</script>

<style scoped></style>
