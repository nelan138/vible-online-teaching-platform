<template>
   <UContainer>
      <h1 class="text-heading-1">{{ course.name }}</h1>
      <p>Teacher: {{ course.teacherName }}</p>
      <p class="mt-4">{{ course.description }}</p>
   </UContainer>
</template>

<script setup lang="ts">
definePageMeta({ middleware: "authenticate-user" });

const route = useRoute();
const store = useTeacherCoursesStore();
const teacherId = route.meta.user.id;
await callOnce(`teacher-courses-${teacherId}`, () => store.loadCourses(teacherId));

const course = computed(() => {
   const match = store.courses.find((item) =>
      item.id === route.params.id || item.name.toLowerCase().replaceAll(" ", "-") === route.params.id,
   );
   if (!match) {
      throw createError({ statusCode: 404, statusMessage: "Course not found", fatal: true });
   }
   return match;
});
</script>
