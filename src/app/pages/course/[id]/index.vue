<template>
   <UContainer v-if="course">
      <H1>{{ course.title }}</H1>

      <PageSection collapsible title="Content group 1">
         <template #header-actions>
            <UButton icon="lucide:plus" color="neutral" variant="ghost" />
            <UButton icon="lucide:ellipsis-vertical" color="neutral" variant="ghost" />
         </template>

         <p>Placeholder text</p>

         <div class="flex flex-col gap-4 mt-8">
            <UButton label="File 1" icon="lucide:file-down" color="neutral" variant="link" />

            <USeparator />

            <UButton label="File 2" icon="lucide:file-down" color="neutral" variant="link" />

            <USeparator />

            <UButton label="File 3" icon="lucide:file-down" color="neutral" variant="link" />
         </div>
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
</script>

<style scoped></style>
