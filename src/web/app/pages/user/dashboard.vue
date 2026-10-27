<template>
   <div>
      <PlaceHolder class="w-full h-[50dvh]" />

      <UContainer class="py-8">
         <section>
            <div class="flex items-center justify-between">
               <H2>Notifications</H2>

               <UButton
                  label="view all"
                  trailing-icon="lucide:chevrons-right"
                  variant="link"
                  color="neutral"
                  to="notifications"
               />
            </div>

            <PlaceHolder class="w-full h-50" />
         </section>

         <section>
            <div class="flex items-center justify-between">
               <H2>Courses</H2>

               <UButton
                  label="view all"
                  trailing-icon="lucide:chevrons-right"
                  variant="link"
                  color="neutral"
                  to="courses"
               />
            </div>

            <div class="grid grid-cols-1 gap-6">
               <UCard v-for="course in courses" :key="course.id" class="flex flex-col h-full">
                  <H3>
                     <NuxtLink :to="`/course/${course.id}`">
                        {{ course.title }}
                     </NuxtLink>
                  </H3>

                  <Description>
                     {{ course.teacher }}
                  </Description>
               </UCard>
            </div>
         </section>
      </UContainer>
   </div>
</template>

<script setup lang="ts">
definePageMeta({
   layout: 'user',
});

const coursesStore = useCoursesStore();

/* *** */

const { courses } = storeToRefs(coursesStore);
</script>

<style scoped></style>
