<template>
   <UContainer class="py-8">
      <div class="flex items-center justify-start">
         <h2 class="py-4 text-xl font-semibold text-highlighted">Notifications</h2>
      </div>

      <div class="grid grid-cols-1 gap-8">
         <PlaceHolder class="h-20"/>
         <PlaceHolder class="h-20"/>
         <PlaceHolder class="h-20"/>
         <PlaceHolder class="h-20"/>
      </div>
   </UContainer>
</template>

<script setup lang="ts">
definePageMeta({
   layout: 'user',
});
</script>

<style scoped></style>
