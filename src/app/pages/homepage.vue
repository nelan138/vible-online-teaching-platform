<template>
   <UContainer>
      <section class="py-12 text-center bg-info-300 my-4">
         <h1 class="text-3xl font-bold text-highlighted">Hero Section</h1>
         <p class="mt-2 text-muted">Place holder text</p>
      </section>

      <USeparator />

      <!-- Courses -->
      <section class="py-10">
         <div class="mb-6 flex items-center justify-between">
            <h2 class="text-xl font-semibold text-highlighted">Your Courses</h2>
            <UButton
               variant="ghost"
               color="neutral"
               label="View all"
               icon="i-lucide-chevron-right"
               trailing
               to="/courses"
               size="sm"
            />
         </div>

         <div v-if="coursesStore.courses.length" class="grid gap-4 grid-cols-1">
            <UPageCard
               v-for="course in coursesStore.courses"
               :key="course.id"
               :title="course.name"
               :description="course.description"
               :to="`/courses/${course.id}`"
            />
         </div>

         <UEmpty
            v-else
            icon="i-lucide-book-open"
            title="No courses yet"
            description="Courses will appear here once they are available."
         />
      </section>
   </UContainer>
</template>

<script setup lang="ts">
const coursesStore = useCoursesStore();

/* *** */

onMounted(async () => {
   await coursesStore.load();
});
</script>

<style scoped></style>
