<template>
   <UContainer v-if="course">
      <H1>{{ course.title }}</H1>

      <PageSection collapsible title="Content group 1" description='afshafkasjfhk'>
         <template #header-actions>
            <UButton icon="lucide:plus" color="neutral" variant="ghost" />
            <UButton icon="lucide:ellipsis-vertical" color="neutral" variant="ghost" />
         </template>

         <PageCardList :items="fileItems" />
      </PageSection>
   </UContainer>
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

const fileItems = [1, 2, 3].map((file) => ({
   name: `File ${file}`,
   description: '',
   icon: 'i-lucide-file-down',
}));
</script>

<style scoped></style>
