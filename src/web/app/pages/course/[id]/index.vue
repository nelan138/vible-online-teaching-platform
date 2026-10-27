<template>
   <div v-if="course">
      <h2 class="text-2xl font-bold text-highlighted">{{ course.title }}</h2>
      <p class="text-muted mt-1">Teachers: {{ course.teacher }}</p>

      <div class="grid grid-cols-1 gap-8 mt-4">
         <ContentPlaceholder class="h-50" />
         <ContentPlaceholder class="h-100" />
         <ContentPlaceholder class="h-80" />
         <ContentPlaceholder class="h-100" />
      </div>
   </div>

   <div v-else>
      <p>Course not found</p>
   </div>
</template>

<script setup lang="ts">
definePageMeta({
   layout: 'course',
});

const coursesStore = useCoursesStore();
const { courses } = storeToRefs(coursesStore);
const route = useRoute();
const id = Number(route.params.id);

/* *** */

const course = ref<Course>();

onMounted(() => {
   course.value = courses.value.find((c) => c.id === id);
});
</script>

<style scoped></style>
