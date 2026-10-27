<template>
   <div>
      <UHeader to="/dashboard">
         <template #left>
            <NuxtLink to="/dashboard" class="shrink-0 font-bold text-xl text-highlighted me-4"> Vible </NuxtLink>

            <UNavigationMenu :items="navigationItems" variant="link" />
         </template>

         <template #right>
            <UButton icon="lucide:bell" variant="ghost" color="neutral" />

            <UColorModeButton />

            <UButton icon="lucide:user" variant="ghost" color="neutral" to="/user/my_profile" />
         </template>
      </UHeader>

      <UMain>
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
                  color="neutral"
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
               />
            </template>
         </USidebar>

         <UContainer class="py-6">
            <slot />
         </UContainer>
      </UMain>
   </div>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';
const route = useRoute();
const courseId = route.params.id;

/* *** */

const isSidebarOpen = ref(false);

const sidebarItems = computed<NavigationMenuItem[][]>(() => [
   [
      {
         label: 'Recent activities',
         icon: 'lucide:clock',
      },
      {
         label: 'Content',
         icon: 'lucide:layers',
      },
   ],
   [
      {
         label: 'Discussion Forum',
         icon: 'lucide:messages-square',
         to: `/course/${courseId}/discussion-forum`,
      },
      {
         label: 'Roster',
         icon: 'lucide:users',
         to: `/course/${courseId}/roster`,
      },
   ],
   [
      {
         label: 'Back to Courses',
         icon: 'lucide:arrow-left',
         to: '/user/courses',
      },
   ],
]);

const navigationItems = computed<NavigationMenuItem[]>(() => [
   {
      label: 'Dashboard',
      to: '/user/dashboard',
   },
   {
      label: 'My Courses',
      to: '/user/courses',
   },
   {
      label: 'Notifications',
      to: '/user/notifications',
   },
]);
</script>

<style scoped></style>
