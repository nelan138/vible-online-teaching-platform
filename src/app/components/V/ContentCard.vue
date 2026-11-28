<template>
   <UCard class="overflow-hidden" :ui="{ body: 'p-0 sm:p-0' }">
      <UCollapsible>
         <template #default="{ open }">
            <div class="flex items-center gap-4 px-4 py-4 sm:px-6">
               <UButton
                  :icon="open ? 'lucide:chevron-down' : 'lucide:chevron-right'"
                  :aria-label="title"
                  class="rounded-full"
                  size="xl"
                  color="primary"
               />

               <div class="flex-1">
                  <h2 class="text-xl font-bold">{{ title }}</h2>

                  <p v-if="open" class="text-muted">{{ description }}</p>
               </div>

               <div
                  v-if="$slots['header-actions']"
                  class="flex items-center gap-4"
                  @click.stop
               >
                  <slot name="header-actions" />
               </div>
            </div>
         </template>

         <template #content>
            <div class="border-t border-default p-4 sm:p-6">
               <slot />
            </div>

            <div
               v-if="$slots['footer']"
               class="border-t border-default p-4 sm:p-6"
            >
               <slot name="footer" />
            </div>
         </template>
      </UCollapsible>
   </UCard>
</template>

<script setup lang="ts">
defineProps<{
   title: string;
   description?: string;
}>();
</script>
