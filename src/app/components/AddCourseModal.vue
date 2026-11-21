<template>
   <UModal title="Add a new course" :close="{ disabled: savingCourse }" :dismissible="!savingCourse">
      <template #body="{ close }">
         <UForm :state="courseForm" :validate="validateCourse" class="space-y-4" @submit="submitCourse">
            <UFormField label="Name" name="name" required>
               <UInput v-model="courseForm.name" class="w-full" />
            </UFormField>

            <div class="flex justify-end gap-2">
               <UButton
                  type="button"
                  label="Cancel"
                  color="neutral"
                  variant="outline"
                  :disabled="savingCourse"
                  @click="close()"
               />
               <UButton type="submit" label="Add" :loading="savingCourse" />
            </div>
         </UForm>
      </template>
   </UModal>
</template>

<script setup lang="ts">
import type { FormError } from '@nuxt/ui';

/* *** */

const emit = defineEmits<{ close: [] }>();
const toast = useToast();
const courseForm = reactive({ name: '' });
const savingCourse = ref(false);

function validateCourse(data: typeof courseForm): FormError[] {
   return data.name.trim() ? [] : [{ name: 'name', message: 'Enter a course name.' }];
}

async function submitCourse() {
   if (savingCourse.value) return;

   savingCourse.value = true;
   const [, error] = await tryCatch(useCoursesStore().addCourse({ name: courseForm.name.trim() }));
   savingCourse.value = false;

   if (error) {
      toast.add({
         title: 'Could not add the course',
         description: 'Please try again.',
         color: 'error',
      });
      return;
   }

   emit('close');
}
</script>
