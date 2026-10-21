<template>
   <div>
      <!-- <ContentPlaceholder class="w-full h-[50dvh]" /> -->

      <NuxtImg src="images/ayanokouji.jpeg" class="w-full aspect-4/1"/>

      <UContainer class="py-8">
         <div>
            <div class="flex items-center justify-between">
               <h2 class="py-4 text-xl font-semibold text-highlighted">
                  Notifications
               </h2>

               <NuxtLink
                  to="/notifications"
                  class="flex items-center gap-1 text-sm text-muted hover:text-info hover:underline"
               >
                  <span>view all</span>
                  <UIcon name="lucide:chevrons-right" class="size-4" />
               </NuxtLink>
            </div>

            <ContentPlaceholder class="w-full h-50" />
         </div>

         <div>
            <div class="flex items-center justify-between">
               <h2 class="py-4 text-xl font-semibold text-highlighted">
                  My courses
               </h2>

               <NuxtLink
                  to="/courses"
                  class="flex items-center gap-1 text-sm text-muted hover:text-info hover:underline"
               >
                  <span>view all</span>
                  <UIcon name="lucide:chevrons-right" class="size-4" />
               </NuxtLink>
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
                        <UButton
                           icon="lucide:ellipsis-vertical"
                           variant="ghost"
                           color="neutral"
                        />
                     </div>
                  </template>
               </UCard>
            </div>
         </div>
      </UContainer>
   </div>
</template>

<script setup lang="ts">
definePageMeta({
   layout: "app",
});

const coursesStore = useCoursesStore();

/* *** */

const { courses } = storeToRefs(coursesStore);
</script>

<style scoped></style>
