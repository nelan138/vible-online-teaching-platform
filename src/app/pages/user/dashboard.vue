<template>
   <div>
      <DashboardHero />

      <UContainer class="py-8">
         <DashboardSection title="My courses">
            <template #header-actions>
               <UButton
                  to="/user/courses"
                  label="view all"
                  trailing-icon="lucide:chevrons-right"
                  color="neutral"
                  variant="link"
               />
            </template>

            <DashboardCard
               v-for="course in courses"
               :key="course.id"
               :to="`/course/${course.id}`"
               :title="course.title"
               :description="course.teacher"
               class="mb-4"
            />
         </DashboardSection>
      </UContainer>
   </div>
</template>

<script setup lang="ts">
definePageMeta({
   layout: 'user',
   middleware: 'authenticate-user',
});

const coursesStore = useCoursesStore();

/* *** */

const { courses } = storeToRefs(coursesStore);
</script>

<style scoped></style>
