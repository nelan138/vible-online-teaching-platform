<template>
   <section class="mb-4">
      <div
         class="flex justify-between items-center w-full"
         :class="{ 'border-2 border-default rounded-lg px-4': collapsible }"
      >
         <div class="flex gap-4 items-center">
            <UButton
               v-if="collapsible"
               :icon="isOpen ? 'lucide:chevron-down' : 'lucide:chevron-right'"
               color="neutral"
               variant="ghost"
               class="rounded-full"
               @click="isOpen = !isOpen"
            />
            <H2>{{ title }}</H2>
         </div>

         <div v-if="$slots['header-actions']" class="flex gap-4 items-center">
            <slot name="header-actions" />
         </div>
      </div>

      <UCollapsible v-if="collapsible" v-model:open="isOpen" class="mt-4">
         <template #content>
            <UCard>
               <slot />

               <template v-if="$slots.footer" #footer>
                  <slot name="footer" />
               </template>
            </UCard>
         </template>
      </UCollapsible>

      <slot v-else />
   </section>
</template>

<script setup lang="ts">
const {
   title = undefined,
   collapsible = false,
   defaultOpen = true,
} = defineProps<{
   title?: string;
   collapsible?: boolean;
   defaultOpen?: boolean;
}>();

const isOpen = ref(defaultOpen);
</script>
