<template>
   <UCard>
      <NuxtLink :to="to">
         <H3>{{ title }}</H3>
      </NuxtLink>

      <Description>{{ description }}</Description>
   </UCard>
</template>

<script setup lang="ts">
defineProps<{
   title: string;
   description: string;
   to: string;
}>();
</script>
