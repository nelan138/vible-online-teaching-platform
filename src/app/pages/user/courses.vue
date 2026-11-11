<template>
   <UContainer class="py-4">
      <section class="flex justify-end py-4">
         <UFieldGroup>
            <UInput type="text" placeholder="Enter invite code" size="md" />

            <UButton label="Join" />
         </UFieldGroup>
      </section>

      <ContentSection title="My courses">
         <template #header-actions>
            <UButton icon="lucide:plus" variant="ghost" color="neutral" />
            <UButton icon="lucide:ellipsis-vertical" variant="ghost" color="neutral" />
         </template>

         <article class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <UCard
               v-for="course in courses"
               :key="course.id"
               :ui="{
                  header: 'p-0 sm:p-0',
               }"
               class="flex flex-col h-full"
            >
               <template #header>
                  <PlaceHolder class="w-full h-20" />
               </template>

               <template #default>
                  <H3>
                     <NuxtLink :to="`/course/${course.id}`">
                        {{ course.title }}
                     </NuxtLink>
                  </H3>

                  <Description>
                     {{ course.teacher }}
                  </Description>
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
         </article>
      </ContentSection>
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
