<template>
   <UFieldGroup >
      <UInput
         v-model="value"
         type="text"
         :placeholder="placeholder"
         :aria-label="placeholder"
         size="md"
         :ui="{ base: 'focus-visible:outline-transparent focus-visible:ring-2' }"
      />

      <UButton :label="buttonLabel" @click="emit('action')" />
   </UFieldGroup>
</template>

<script setup lang="ts">
defineProps<{
   placeholder: string;
   buttonLabel: string;
}>();

const value = defineModel<string>();
const emit = defineEmits<{ action: [] }>();
</script>
