<template>
   <ContentSection title="Discussion forum">
      <template #header-actions>
         <UButton icon="lucide:plus" color="neutral" variant="ghost" />
         <UButton icon="lucide:bell" color="neutral" variant="ghost" />
         <UButton icon="lucide:ellipsis-vertical" color="neutral" variant="ghost" />
      </template>

      <div class="flex flex-col gap-4">
         <Placeholder class="h-15" />
         <Placeholder class="h-15" />
         <Placeholder class="h-15" />
         <Placeholder class="h-15" />
         <Placeholder class="h-15" />
         <Placeholder class="h-15" />
         <Placeholder class="h-15" />
         <Placeholder class="h-15" />
      </div>
   </ContentSection>
</template>

<script setup lang="ts">
definePageMeta({
   layout: 'course',
});
</script>

<style scoped></style>
