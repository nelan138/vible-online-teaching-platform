<template>
   <UContainer class="py-8">
      <UPageCard title="Debug" class="max-w-md mx-auto">
         <UButton label="Log out" loading-auto @click="logOut" />
      </UPageCard>
   </UContainer>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'account' });
</script>
