<template>
   <UDropdownMenu
      v-model:open="panelOpen"
      class="fixed bottom-8 right-8 z-1000"
      :content="{ side: 'top', align: 'end' }"
      :ui="{ content: 'bg-transparent shadow-none ring-0' }"
   >
      <template #default="{ open }">
         <UButton
            :icon="open ? 'lucide:x' : 'lucide:paw-print'"
            :color="open ? 'primary' : 'neutral'"
            :aria-label="open ? 'Close menu' : 'Open menu'"
            class="p-4 data-[state=open]:rounded-full"
         />
      </template>

      <template #content-top>
         <div class="mb-2 flex flex-col items-end gap-2 *:rounded-3xl *:p-4">
            <slot :close="closePanel" />
         </div>
      </template>
   </UDropdownMenu>
</template>

<script setup lang="ts">
const panelOpen = ref(false);

function closePanel() {
   panelOpen.value = false;
   return nextTick();
}
</script>
