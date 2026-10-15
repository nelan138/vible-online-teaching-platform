<template>
   <p>This is the profile page for user {{ userId }}.</p>
</template>

<script setup lang="ts">
const route = useRoute();
const userId = route.params.userId;

/* *** */
</script>

<style scoped></style>
