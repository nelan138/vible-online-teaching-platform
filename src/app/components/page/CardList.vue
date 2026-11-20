<template>
   <ul class="flex flex-col divide-y divide-accented">
      <slot v-if="$slots.default" />

      <template v-else-if="items !== undefined">
         <li v-for="(item, index) in items" :key="index">
            <NuxtLink :to="item.to" class="flex items-start gap-4 py-4">
               <UIcon :name="item.icon" class="mt-0.5 size-5 shrink-0 text-muted" aria-hidden="true" />

               <div>
                  <span class="font-medium text-highlighted">{{ item.name }}</span>
                  <Description>{{ item.description }}</Description>
               </div>
            </NuxtLink>
         </li>
      </template>
   </ul>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router';

type ListItem = {
   name: string;
   description?: string;
   to?: RouteLocationRaw;
   icon?: string;
};

defineProps<{
   items?: readonly ListItem[];
}>();
</script>
