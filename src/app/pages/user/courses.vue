<template>
   <UContainer>
      <PageSection>
         <UFieldGroup class="ms-auto flex w-fit">
            <UInput placeholder="Enter invite code" />

            <UButton label="Join" color="neutral" />
         </UFieldGroup>
      </PageSection>

      <PageSection title="My courses">
         <template #header-actions>
            <UButton icon="lucide:plus" variant="ghost" color="neutral" />
            <UButton icon="lucide:ellipsis-vertical" variant="ghost" color="neutral" />
         </template>

         <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <PageCard v-for="course in courses" :key="course.id" image="/images/placeholder.svg">
               <H3 class="hover:underline hover:text-info">
                  <NuxtLink :to="`/course/${course.id}`">
                     {{ course.title }}
                  </NuxtLink>
               </H3>

               <Description> {{ course.teacher }} </Description>

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
            </PageCard>
         </div>
      </PageSection>
   </UContainer>
</template>

<script setup lang="ts">
definePageMeta({
   layout: 'user',
});

const coursesStore = useCoursesStore();

/* *** */

const { courses } = storeToRefs(coursesStore);
</script>
