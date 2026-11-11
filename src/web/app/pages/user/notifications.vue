<template>
   <UContainer class="py-8">
      <ContentSection title="Notifications">
         <template #header-actions>
            <UButton icon="lucide:check-check" variant="ghost" color="neutral" />
            <UButton icon="lucide:bell" variant="ghost" color="neutral" />
            <UButton icon="lucide:ellipsis-vertical" variant="ghost" color="neutral" />
         </template>

         <div class="grid grid-cols-1 gap-8">
            <PlaceHolder class="h-20" />
            <PlaceHolder class="h-20" />
            <PlaceHolder class="h-20" />
            <PlaceHolder class="h-20" />
         </div>
      </ContentSection>
   </UContainer>
</template>

<script setup lang="ts">
definePageMeta({
   layout: 'user',
});
</script>

<style scoped></style>
