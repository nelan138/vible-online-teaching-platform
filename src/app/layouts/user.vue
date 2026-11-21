<template>
   <div>
      <UHeader>
         <template #left>
            <NuxtLink to="/user/dashboard" class="shrink-0 font-bold text-xl text-highlighted me-4"> Vible </NuxtLink>

            <UNavigationMenu :items="navigationItems" variant="link" />
         </template>

         <template #right>
            <UButton icon="lucide:bell" variant="ghost" color="neutral" />

            <UColorModeButton />

            <UButton icon="lucide:user" variant="ghost" color="neutral" to="profile" />
         </template>
      </UHeader>

      <UMain>
         <PageHero v-if="route.meta.showUserHero" />

         <FloatingPanel>
            <UButton icon="lucide:plus" label="Add new course" aria-haspopup="dialog" @click="openAddCourseModal" />

            <UButton
               icon="lucide:square-arrow-left-exit"
               label="Log out"
               loading-auto
               color="warning"
               @click="logOut"
            />
         </FloatingPanel>

         <UModal
            v-model:open="addCourseOpen"
            title="Add course"
            :close="{ disabled: savingCourse }"
            :dismissible="!savingCourse"
         >
            <template #body>
               <UForm :state="courseForm" :validate="validateCourse" class="space-y-4" @submit="submitCourse">
                  <UFormField label="Name" name="name" required>
                     <UInput v-model="courseForm.name" class="w-full" />
                  </UFormField>

                  <p v-if="courseSaveFailed" role="alert" class="text-sm text-error">
                     Could not add the course. Please try again.
                  </p>

                  <div class="flex justify-end">
                     <UButton type="submit" color='primary' label="Add course" :loading="savingCourse" />
                  </div>
               </UForm>
            </template>
         </UModal>

         <slot />
      </UMain>
   </div>
</template>

<script setup lang="ts">
import type { FormError, NavigationMenuItem } from '@nuxt/ui';

const route = useRoute();

/* *** */

const navigationItems = computed<NavigationMenuItem[]>(() => [
   {
      label: 'Dashboard',
      to: 'dashboard',
      active: route.path.startsWith('/user/dashboard'),
   },
   {
      label: 'My courses',
      to: 'courses',
      active: route.path.startsWith('/user/courses'),
   },
   {
      label: 'Notifications',
      to: 'notifications',
      active: route.path.startsWith('/user/notifications'),
   },
]);

const addCourseOpen = ref(false);
const courseForm = reactive({ name: '' });
const savingCourse = ref(false);
const courseSaveFailed = ref(false);

function openAddCourseModal() {
   courseForm.name = '';
   courseSaveFailed.value = false;
   addCourseOpen.value = true;
}

function validateCourse(data: typeof courseForm): FormError[] {
   return data.name.trim() ? [] : [{ name: 'name', message: 'Enter a course name.' }];
}

async function submitCourse() {
   if (savingCourse.value) return;

   savingCourse.value = true;
   courseSaveFailed.value = false;
   const [, error] = await tryCatch(useCoursesStore().add({ name: courseForm.name.trim() }));
   savingCourse.value = false;

   if (error) courseSaveFailed.value = true;
   else addCourseOpen.value = false;
}
</script>

<style scoped></style>
