<template>
   <UContainer>
      <PageSection :title="courseName" />

      <PageSection
         v-for="content in contents"
         :key="content.id"
         collapsible
         :title="content.title"
         :description="content.description ?? undefined"
      />

      <FloatingPanel>
         <UButton icon="lucide:plus" label="Add content" aria-haspopup="dialog" @click="openAddContentModal" />

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

/* *** */

const courseName = ref<string>();

const { contents } = storeToRefs(contentsStore);
const addContentOpen = ref(false);
const contentForm = reactive({ title: '', description: '' });
const savingContent = ref(false);
const contentSaveFailed = ref(false);

onMounted(async () => {
   await contentsStore.load(courseId);
   courseName.value = await getCourseNameByCourseId(courseId);
});

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
