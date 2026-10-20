<template>
   <UContainer class="py-6">
      <div v-if="course">
         <h2>{{ course.title }}</h2>
         <p>Teachers: {{ course.teacher }}</p>
      </div>

      <div v-else>
         <p>Course not found.</p>
      </div>
   </UContainer>
</template>

<script setup lang="ts">
definePageMeta({
   layout: "app",
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
