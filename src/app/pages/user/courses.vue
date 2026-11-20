<template>
   <UContainer>
      <PageSection v-if="user.role === 'student'">
         <UFieldGroup class="ms-auto flex w-fit">
            <UInput placeholder="Enter invite code" />

            <UButton label="Join" color="neutral" />
         </UFieldGroup>
      </PageSection>

      <PageSection title="My courses">
         <template v-if="user.role === 'teacher'" #header-actions>
            <UModal
               v-if="user.role === 'teacher'"
               v-model:open="addCourseOpen"
               title="Add course"
               :close="{ disabled: savingCourse }"
               :dismissible="!savingCourse"
               :ui="{ footer: 'justify-end' }"
               @update:open="(open) => open && resetCourseForm()"
            >
               <UButton icon="lucide:plus" variant="ghost" color="neutral" aria-label="Add course" title="Add course" />

               <template #body>
                  <UForm
                     id="add-course-form"
                     :state="courseForm"
                     :validate="validateCourse"
                     class="space-y-4"
                     @submit="submitCourse"
                  >
                     <UFormField name="name" label="Course name" required>
                        <UInput v-model="courseForm.name" class="w-full" />
                     </UFormField>

                     <p v-if="courseSaveFailed" role="alert" class="text-sm text-error">
                        Could not add the course. Please try again.
                     </p>
                  </UForm>
               </template>

               <template #footer="{ close }">
                  <UButton label="Cancel" color="neutral" variant="outline" :disabled="savingCourse" @click="close" />
                  <UButton type="submit" form="add-course-form" label="Add course" :loading="savingCourse" />
               </template>
            </UModal>

            <UButton icon="lucide:ellipsis-vertical" variant="ghost" color="neutral" />
         </template>

         <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <!-- ! Teacher Only -->
            <template v-if="user.role === 'teacher'">
               <PageCard v-for="course in courses" :key="course.id" image="/images/placeholder.svg">
                  <H3 class="hover:underline hover:text-info">
                     <NuxtLink :to="`/course/${course.id}`">
                        {{ course.name }}
                     </NuxtLink>
                  </H3>

                  <Description v-if="teacherNames[course.teacherId] !== undefined">
                     {{ teacherNames[course.teacherId] ?? 'Unknown teacher' }}
                  </Description>

                  <template #footer>
                     <div class="flex justify-between items-center">
                        <UButton
                           :to="`/course/${course.id}`"
                           icon="lucide:square-arrow-right-enter"
                           variant="ghost"
                           color="neutral"
                        />

                        <UButton icon="lucide:ellipsis-vertical" variant="ghost" color="neutral" />
                     </div>
                  </template>
               </PageCard>
            </template>
         </div>
      </PageSection>
   </UContainer>
</template>

<script setup lang="ts">
import type { FormError } from '@nuxt/ui';

definePageMeta({
   layout: 'user',
});

const coursesStore = useCoursesStore();
const userStore = useUserStore();

/* *** */

const { courses } = storeToRefs(coursesStore);
const user = computed(() => {
   const profile = userStore.user;
   if (!profile) throw createError({ statusCode: 503, statusMessage: 'Account profile is unavailable' });
   return profile;
});

const teacherIds = computed(() => [...new Set(courses.value.map((course) => course.teacherId))]);
const { data: teacherNames } = useAsyncData<Record<string, string | null>>(
   'course-teacher-names',
   async () => {
      const names = await Promise.all(
         teacherIds.value.map(async (teacherId) => {
            const [name] = await tryCatch(getUserNameWithUserId(teacherId));
            return [teacherId, name] as const;
         })
      );
      return Object.fromEntries(names);
   },
   { server: false, default: () => ({}), watch: [() => teacherIds.value.join(',')] }
);

const addCourseOpen = ref(false);
const savingCourse = ref(false);
const courseSaveFailed = ref(false);
const courseForm = reactive({ name: '' });

function resetCourseForm() {
   courseForm.name = '';
   courseSaveFailed.value = false;
}

function validateCourse(data: typeof courseForm): FormError[] {
   return data.name.trim() ? [] : [{ name: 'name', message: 'Enter a course name.' }];
}

async function submitCourse() {
   if (savingCourse.value) return;

   savingCourse.value = true;
   courseSaveFailed.value = false;

   const [, error] = await tryCatch(coursesStore.add({ name: courseForm.name.trim() }));

   savingCourse.value = false;
   courseSaveFailed.value = Boolean(error);
   if (!error) addCourseOpen.value = false;
}
</script>
