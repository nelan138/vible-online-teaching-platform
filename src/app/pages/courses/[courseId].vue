<template>
   <div class="flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center gap-4 p-4">
      <p>Course: {{ course?.name }}</p>
      <p>Description: {{ course?.description }}</p>
   </div>
</template>

<script setup lang="ts">
const route = useRoute();
const coursesStore = useCoursesStore();

/* *** */

const course = ref<Course>();

onMounted(async () => {
   const courseId = Number(route.params.courseId);

   const [result, error] = await tryCatch(coursesStore.getCourseById(courseId));

   if (!result || error) {
      navigateTo('/error');
      return;
   }

   course.value = result;
});
</script>

<style scoped></style>
