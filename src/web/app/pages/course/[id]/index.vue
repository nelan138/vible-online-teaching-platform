<template>
   <div v-if="course" class="flex flex-col gap-4">
      <H2>{{ course.title }}</H2>

      <section>
         <UCollapsible>
            <UButton
               label="Recent activities"
               color="neutral"
               variant="outline"
               trailing-icon="i-lucide-chevron-down"
               block
            />

            <template #content>
               <UCard class="mt-4">
                  <div class="flex flex-col gap-4">
                     <PlaceHolder class="h-20" />
                     <PlaceHolder class="h-20" />
                     <PlaceHolder class="h-20" />
                  </div>

                  <template #footer>
                     <div class="flex justify-end">
                        <dic class="flex gap-4">
                           <UButton icon="lucide:plus" color="neutral" variant="outline" />
                           <UButton icon="lucide:ellipsis-vertical" color="neutral" variant="outline" />
                        </dic>
                     </div>
                  </template>
               </UCard>
            </template>
         </UCollapsible>
      </section>

      <section>
         <UCollapsible default-open>
            <UButton
               label="Content group 1"
               color="neutral"
               variant="outline"
               trailing-icon="i-lucide-chevron-down"
               block
            />

            <template #content>
               <UCard class="mt-4">
                  <div class="flex flex-col gap-4">
                     <PlaceHolder class="h-20" />
                     <PlaceHolder class="h-20" />
                     <PlaceHolder class="h-20" />
                  </div>

                  <template #footer>
                     <div class="flex justify-end">
                        <dic class="flex gap-4">
                           <UButton icon="lucide:plus" color="neutral" variant="outline" />
                           <UButton icon="lucide:ellipsis-vertical" color="neutral" variant="outline" />
                        </dic>
                     </div>
                  </template>
               </UCard>
            </template>
         </UCollapsible>
      </section>

      <section class="flex items-center justify-center mt-4">
         <UButton label="Add content group" color="neutral" variant="outline" trailing-icon="lucide:plus" />
      </section>
   </div>

   <div v-else>
      <p>Course not found</p>
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
