<template>
   <UContainer>
      <PageSection title="My courses">
         <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <template v-if="user.role === 'teacher'">
               <PageCard v-for="course in courses" :key="course.id" image="/images/placeholder.svg">
                  <h3 class="heading-base line-clamp-1 text-link">
                     <NuxtLink :to="`/course/${course.id}`">
                        {{ course.name }}
                     </NuxtLink>
                  </h3>

                  <p class='text-muted mt-2'>Teacher: {{ user.name }}</p>

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
   layout: 'app',
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
