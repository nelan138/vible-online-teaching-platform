<template>
   <div v-if="course" class="flex flex-col">
      <section>
         <H1>{{ course.title }}</H1>
      </section>

      <ContentSection collapsible title="Announcements">
         <template #header-actions>
            <UButton icon="lucide:plus" color="neutral" variant="ghost" />
            <UButton icon="lucide:bell" color="neutral" variant="ghost" />
            <UButton icon="lucide:ellipsis-vertical" color="neutral" variant="ghost" />
         </template>

         <div class="flex flex-col gap-4">
            <PlaceHolder class="h-15" />
            <PlaceHolder class="h-15" />
            <PlaceHolder class="h-15" />
         </div>
      </ContentSection>

      <ContentSection collapsible title="Content group 1">
         <template #header-actions>
            <UButton icon="lucide:plus" color="neutral" variant="ghost" />
            <UButton icon="lucide:ellipsis-vertical" color="neutral" variant="ghost" />
         </template>

         <div>
            <p>Placeholder text</p>

            <div class="flex flex-col gap-4 mt-8">
               <UButton label="File 1" icon="lucide:file-down" color="neutral" variant="link" />

               <USeparator />

               <UButton label="File 2" icon="lucide:file-down" color="neutral" variant="link" />

               <USeparator />

               <UButton label="File 3" icon="lucide:file-down" color="neutral" variant="link" />
            </div>
         </div>
      </ContentSection>

      <section class="flex items-center justify-center my-4">
         <UButton label="Add content group" color="neutral" variant="outline" trailing-icon="lucide:plus" class="p-4" />
      </section>
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
