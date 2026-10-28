<template>
   <UCard as="article">
      <template #header>
         <dic class="flex justify-between items-center">
            <H2 class="self-start">Discussion Forum</H2>

            <div class="flex gap-4">
               <UButton icon="lucide:plus" color="neutral" variant="outline" />
               <UButton icon="lucide:bell" color="neutral" variant="outline" />
               <UButton icon="lucide:ellipsis-vertical" color="neutral" variant="outline" />
            </div>
         </dic>
      </template>

      <div class="flex flex-col gap-4">
         <PlaceHolder class="h-15" />
         <PlaceHolder class="h-15" />
         <PlaceHolder class="h-15" />
         <PlaceHolder class="h-15" />
         <PlaceHolder class="h-15" />
         <PlaceHolder class="h-15" />
         <PlaceHolder class="h-15" />
         <PlaceHolder class="h-15" />
      </div>
   </UCard>
</template>

<script setup lang="ts">
definePageMeta({
   layout: 'course',
});
</script>

<style scoped></style>
