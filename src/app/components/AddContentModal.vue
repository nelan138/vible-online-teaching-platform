<template>
   <UModal title="Add content" :close="{ disabled: savingContent }" :dismissible="!savingContent">
      <template #body="{ close }">
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

            <div class="flex justify-end gap-2">
               <UButton
                  type="button"
                  label="Cancel"
                  color="neutral"
                  variant="outline"
                  :disabled="savingContent"
                  @click="close()"
               />
               <UButton type="submit" label="Add content" :loading="savingContent" />
            </div>
         </UForm>
      </template>
   </UModal>
</template>

<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '@nuxt/ui';

const props = defineProps<{ courseId: string }>();
const emit = defineEmits<{ close: [] }>();

/* *** */

const toast = useToast();
const contentForm = reactive({ title: '', description: '' });
const savingContent = ref(false);

function validateContent(data: typeof contentForm): FormError[] {
   return data.title.trim() ? [] : [{ name: 'title', message: 'Enter a title.' }];
}

async function submitContent({ data }: FormSubmitEvent<typeof contentForm>) {
   if (savingContent.value) return;

   savingContent.value = true;
   const [, error] = await tryCatch(
      useContentsStore().addContent({
         courseId: props.courseId,
         title: data.title.trim(),
         description: data.description.trim() ? data.description : null,
      })
   );
   savingContent.value = false;

   if (error) {
      toast.add({
         title: 'Could not add the content',
         description: 'Please try again.',
         color: 'error',
      });
      return;
   }

   emit('close');
}
</script>
