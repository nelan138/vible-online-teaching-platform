<template>
   <UCard :ui="image ? { header: 'p-0 sm:px-0 p-0' } : undefined">
      <template v-if="image || $slots.header" #header>
         <NuxtImg v-if="image" :src="image" :alt="imageAlt" class="block aspect-4/1 w-full object-cover" />

         <slot v-else name="header" />
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
