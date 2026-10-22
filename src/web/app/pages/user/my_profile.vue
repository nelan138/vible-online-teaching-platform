<template>
   <UContainer class="py-8">
      <div class="flex items-center justify-start">
         <h2 class="py-4 text-xl font-semibold text-highlighted">My profile</h2>
      </div>

      <div class="grid grid-cols-1 gap-4">
         <div class="grid grid-cols-[2fr_3fr] gap-4">
            <ContentPlaceholder class="h-50" />
            <ContentPlaceholder class="h-50" />
         </div>

         <ContentPlaceholder class="h-100" />
      </div>
   </UContainer>
</template>

<script setup lang="ts">
definePageMeta({
   layout: 'app',
});
</script>

<style scoped></style>
