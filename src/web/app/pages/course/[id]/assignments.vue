<template>
   <div>
      <section>
         <H2> Assignments </H2>
      </section>

      <ContentSection collapsible title="Assignment 1">
         <template #header-actions>
            <UButton icon="lucide:plus" color="neutral" variant="ghost" />
            <UButton icon="lucide:ellipsis-vertical" color="neutral" variant="ghost" />
         </template>

         <div>
            <p>Placeholder text</p>

            <section class="flex flex-col gap-4 mt-8">
               <UButton label="Attachment 1" icon="lucide:file-down" color="neutral" variant="link" />

               <USeparator />

               <UButton label="Attachment 2" icon="lucide:file-down" color="neutral" variant="link" />

               <USeparator />

               <UButton label="Attachment 3" icon="lucide:file-down" color="neutral" variant="link" />
            </section>
         </div>

         <template #footer>
            <div class="flex justify-between items-center">
               <div class="flex gap-4 items-center">
                  <H3>Submission 1</H3>
                  <Description>Status: grade, late / on time, . . .</Description>
               </div>

               <div class="flex items-center gap-4">
                  <UButton label="Submit" color="neutral" variant="outline" />
                  <UButton label="Grade" color="neutral" variant="outline" />
                  <UButton icon="lucide:ellipsis-vertical" color="neutral" variant="ghost"/>
               </div>
            </div>
         </template>
      </ContentSection>

      <ContentSection :default-open="false" collapsible title="Assignment 2">
         <template #header-actions>
            <UButton icon="lucide:plus" color="neutral" variant="ghost" />
            <UButton icon="lucide:ellipsis-vertical" color="neutral" variant="ghost" />
         </template>

         <div>
            <p>Placeholder text</p>

            <section class="flex flex-col gap-4 mt-8">
               <UButton label="Attachment 1" icon="lucide:file-down" color="neutral" variant="link" />

               <USeparator />

               <UButton label="Attachment 2" icon="lucide:file-down" color="neutral" variant="link" />

               <USeparator />

               <UButton label="Attachment 3" icon="lucide:file-down" color="neutral" variant="link" />
            </section>
         </div>

         <template #footer>
            <div class="flex justify-between items-center">
               <div class="flex gap-4 items-center">
                  <H3>Submission 1</H3>
                  <Description>Status: grade, late / on time, . . .</Description>
               </div>

               <div class="flex items-center gap-4">
                  <UButton label="Submit" color="neutral" variant="outline" />
                  <UButton label="Grade" color="neutral" variant="outline" />
                  <UButton icon="lucide:ellipsis-vertical" color="neutral" variant="ghost"/>
               </div>
            </div>
         </template>
      </ContentSection>

      <section class="flex items-center justify-center my-4">
         <UButton label="Add assignment" color="neutral" variant="outline" trailing-icon="lucide:plus" />
      </section>
   </div>
</template>

<script setup lang="ts">
definePageMeta({
   layout: 'course',
});
</script>

<style scoped></style>
