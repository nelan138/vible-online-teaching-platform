<template>
   <UContainer class="py-6">
      <h2>All Courses</h2>

      <div v-for="course in courses" :key="course.id" class="my-4">
         <h3>
            <NuxtLink :to="`/course/${course.id}`" class="hover:underline hover:text-info">
               {{ course.title }}
            </NuxtLink>
         </h3>
         <p>Teachers: {{ course.teacher }}</p>
      </div>
   </UContainer>
</template>

<script setup lang="ts">
definePageMeta({
   layout: "app",
});

const coursesStore = useCoursesStore();

/* *** */

const { courses } = storeToRefs(coursesStore);
</script>
