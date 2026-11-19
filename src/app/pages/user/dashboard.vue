<template>
   <UContainer>
      <PageSection title="My courses">
         <template #header-actions>
            <UButton
               to="/user/courses"
               label="view all"
               trailing-icon="lucide:chevrons-right"
               color="neutral"
               variant="link"
            />
         </template>

         <PageCard v-for="course in courses" :key="course.id" class="mb-4 last:mb-0">
            <NuxtLink :to="`/course/${course.id}`">
               <H3>{{ course.title }}</H3>
            </NuxtLink>

            <Description>{{ course.teacher }}</Description>
         </PageCard>
      </PageSection>
   </UContainer>
</template>

<script setup lang="ts">
definePageMeta({
   layout: 'user',
   middleware: 'authenticate-user',
   showUserHero: true,
});

const coursesStore = useCoursesStore();

/* *** */

const { courses } = storeToRefs(coursesStore);
</script>

<style scoped></style>
