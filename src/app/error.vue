<template>
   <div>
      <h1>{{ error?.statusCode || 500 }}</h1>
      <p>{{ error?.statusMessage || "Something went wrong." }}</p>
   </div>
</template>

<script setup lang="ts">
defineProps<{
   error: {
      statusCode?: number;
      statusMessage?: string;
   };
}>();
</script>
