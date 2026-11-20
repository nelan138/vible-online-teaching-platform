<template>
   <UCard :ui="image && !$slots.header ? { header: 'p-0 sm:px-0 p-0' } : undefined">
      <template v-if="$slots.header || image" #header>
         <slot v-if="$slots.header" name="header" />

         <NuxtImg v-else :src="image" :alt="imageAlt" class="block aspect-4/1 w-full object-cover" />
      </template>

      <slot />

      <template v-if="$slots.footer" #footer>
         <slot name="footer" />
      </template>
   </UCard>
</template>

<script setup lang="ts">
const { image = undefined, imageAlt = '' } = defineProps<{
   image?: string;
   imageAlt?: string;
}>();
</script>
