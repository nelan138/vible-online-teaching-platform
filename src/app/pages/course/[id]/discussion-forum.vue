<template>
   <UContainer> Hello, World </UContainer>
</template>

<script setup lang="ts">
definePageMeta({
   layout: 'app',
   middleware: 'authenticate-user',
   showCourseSidebar: true,
});
</script>

<style scoped></style>
