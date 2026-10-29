<template>
   <div>
      <section>
         <H2> Assignments </H2>

         <UCollapsible>
            <UButton
               label="Assignment 1"
               color="neutral"
               variant="outline"
               trailing-icon="i-lucide-chevron-down"
               block
            />

            <template #content>
               <UCard class="mt-4">
                  <template #header>
                     <dic class="flex justify-between items-center gap-4">
                        <H2> Heading text</H2>

                        <div class="flex gap-4">
                           <UButton icon="lucide:ellipsis-vertical" color="neutral" variant="outline" />
                        </div>
                     </dic>
                  </template>

                  <div>
                     <p>Assignment Description</p>

                     <section class="flex flex-col gap-4 mt-8">
                        <UButton
                           label="Attachment 1"
                           icon="lucide:file-down"
                           color="neutral"
                           variant="link"
                           class="underline"
                        />

                        <USeparator />

                        <UButton
                           label="Attachment 2"
                           icon="lucide:file-down"
                           color="neutral"
                           variant="link"
                           class="underline"
                        />
                     </section>
                  </div>

                  <template #footer>
                     <ul class="flex flex-col gap-4">
                        <li class="flex justify-between items-center">
                           <div class="flex gap-4">
                              <H3>Submission 1</H3>
                              <Description>Status: grade, late / on time, . . .</Description>
                           </div>

                           <div class="flex items-center gap-4">
                              <UButton label="Submit" color="neutral" variant="outline" />
                              <UButton icon="lucide:pen-tool" color="neutral" variant="outline" />
                              <UButton icon="lucide:x" color="neutral" variant="outline" />
                              <UButton icon="lucide:ellipsis-vertical" color="neutral" variant="outline" />
                           </div>
                        </li>

                        <USeparator />

                        <li class="flex justify-between items-center">
                           <div class="flex gap-4">
                              <H3>Submission 2</H3>
                              <Description>Status: grade, late / on time, . . .</Description>
                           </div>

                           <div class="flex items-center gap-4">
                              <UButton label="Submit" color="neutral" variant="outline" />
                              <UButton icon="lucide:pen-tool" color="neutral" variant="outline" />
                              <UButton icon="lucide:x" color="neutral" variant="outline" />
                              <UButton icon="lucide:ellipsis-vertical" color="neutral" variant="outline" />
                           </div>
                        </li>
                     </ul>
                  </template>
               </UCard>
            </template>
         </UCollapsible>
      </section>

      <section class="flex items-center justify-center mt-4">
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
