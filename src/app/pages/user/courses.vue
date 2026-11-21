<template>
   <UContainer>
      <PageSection v-if="user.role === 'student'">
         <UFieldGroup class="ms-auto flex w-fit">
            <UInput placeholder="Enter invite code" />

            <UButton label="Join" color="neutral" />
         </UFieldGroup>
      </PageSection>

      <PageSection title="My courses">
         <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <!-- ! Teacher Only -->
            <template v-if="user.role === 'teacher'">
               <PageCard v-for="course in courses" :key="course.id" image="/images/placeholder.svg">
                  <H3 class="hover:underline hover:text-info">
                     <NuxtLink :to="`/course/${course.id}`">
                        {{ course.name }}
                     </NuxtLink>
                  </H3>

                  <Description>{{ user.name }}</Description>

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
definePageMeta({
   layout: 'user',
   middleware: 'authenticate-user',
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
</script>
