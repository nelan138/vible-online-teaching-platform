<template>
   <USidebar
      v-model:open="isSidebarOpen"
      collapsible="icon"
      rail
      :ui="{
         container:
            'top-(--ui-header-height) h-[calc(100svh-var(--ui-header-height))] bg-default border-r border-default',
      }"
   >
      <template #header="{ state }">
         <UButton
            :icon="state === 'collapsed' ? 'lucide:arrow-right-from-line' : 'lucide:arrow-left-from-line'"
            :label="state === 'expanded' ? 'Close' : undefined"
            variant="ghost"
            :aria-label="state === 'collapsed' ? 'Expand sidebar' : 'Collapse sidebar'"
            @click="isSidebarOpen = !isSidebarOpen"
         />
      </template>

      <template #default="{ state }">
         <UNavigationMenu
            orientation="vertical"
            :items="sidebarItems"
            :collapsed="state === 'collapsed'"
            class="w-full"
            variant="link"
         />
      </template>
   </USidebar>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';

const route = useRoute();

/* *** */

const isSidebarOpen = ref(false);

const sidebarItems = computed<NavigationMenuItem[][]>(() => {
   const courseId = route.params.id;

   return [
      [
         {
            label: 'Content',
            icon: 'lucide:layers',
            to: `/course/${courseId}`,
            active: false,
         },
      ],
      [
         {
            label: 'Discussion Forum',
            icon: 'lucide:messages-square',
            to: `/course/${courseId}/discussion-forum`,
         },
         {
            label: 'Assignments',
            icon: 'lucide:swatch-book',
            to: `/course/${courseId}/assignments`,
         },
         {
            label: 'Roster',
            icon: 'lucide:users',
            to: `/course/${courseId}/roster`,
         },
      ],
      [
         {
            label: 'Go back',
            icon: 'lucide:arrow-left',
            to: `/course/${courseId}`,
            active: false,
         },
      ],
   ];
});
</script>
