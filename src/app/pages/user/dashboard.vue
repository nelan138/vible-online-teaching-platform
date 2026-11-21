<template>
   <UContainer>
      <PageSection title="My courses">
         <template #header-actions>
            <UButton to="/user/courses" label="view all" trailing-icon="lucide:chevrons-right" variant="link" />
         </template>

         <template v-if="user.role === 'teacher'">
            <PageCard v-for="course in courses" :key="course.id" class="mb-4 last:mb-0">
               <NuxtLink :to="`/course/${course.id}`">
                  <h3 class="heading-base line-clamp-1 text-link">{{ course.name }}</h3>
               </NuxtLink>

               <p class="text-xs text-muted mt-2">Teacher: {{ user.name }}</p>
            </PageCard>
         </template>
      </PageSection>
   </UContainer>
</template>

<script setup lang="ts">
definePageMeta({
   layout: 'app',
   middleware: 'authenticate-user',
   showUserHero: true,
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
