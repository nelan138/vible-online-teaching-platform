<template>
   <div>
      <PlaceHolder class="w-full h-[50dvh]" />

      <UContainer class="py-8">
         <ContentSection title="My courses">
            <template #header-actions>
               <UButton
                  to="/user/courses"
                  label="view all"
                  trailing-icon="lucide:chevrons-right"
                  color="neutral"
                  variant="link"
               />
            </template>

            <UCard v-for="course in courses" :key="course.id" class="mb-4">
               <NuxtLink :to="`/course/${course.id}`">
                  <H3>{{ course.title }}</H3>
               </NuxtLink>

               <Description>{{ course.teacher }}</Description>
            </UCard>
         </ContentSection>
      </UContainer>
   </div>
</template>

<script setup lang="ts">
definePageMeta({
   layout: 'user',
});

const coursesStore = useCoursesStore();

/* *** */

const { courses } = storeToRefs(coursesStore);
</script>

<style scoped></style>
