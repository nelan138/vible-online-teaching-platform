<template>
   <ContentSection :title="title">
      <template v-if="$slots['header-actions']" #header-actions>
         <slot name="header-actions" />
      </template>

      <slot />
   </ContentSection>
</template>

<script setup lang="ts">
defineProps<{
   title: string;
}>();
</script>
