<template>
   <UContainer class="py-8">
      <div class="flex items-center justify-between">
         <h2 class="py-4 text-xl font-semibold text-highlighted">My courses</h2>

         <UButton icon="lucide:folder-plus" variant="ghost" color="neutral" />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
         <UCard
            v-for="course in courses"
            :key="course.id"
            :ui="{
               header: 'p-0 sm:p-0',
            }"
            class="flex flex-col h-full"
         >
            <template #header>
               <ContentPlaceholder class="w-full h-20" />
            </template>

            <template #default>
               <NuxtLink
                  :to="`/course/${course.id}`"
                  class="font-semibold text-highlighted text-base line-clamp-1 hover:underline hover:text-info"
               >
                  {{ course.title }}
               </NuxtLink>

               <p class="text-sm text-muted mt-1">
                  {{ course.teacher }}
               </p>
            </template>

            <template #footer>
               <div class="flex justify-between items-center">
                  <UButton
                     :to="`/course/${course.id}`"
                     icon="lucide:square-arrow-right-enter"
                     variant="ghost"
                     color="neutral"
                  />
                  <UButton icon="lucide:ellipsis-vertical" variant="ghost" color="neutral" />
               </div>
            </template>
         </UCard>
      </div>
   </UContainer>
</template>

<script setup lang="ts">
definePageMeta({
   layout: 'homepage',
});

const coursesStore = useCoursesStore();

/* *** */

const { courses } = storeToRefs(coursesStore);
</script>
