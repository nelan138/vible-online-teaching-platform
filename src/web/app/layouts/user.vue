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

            <UButton icon="lucide:user" variant="ghost" color="neutral" to="profile" />
         </template>
      </UHeader>

      <UMain>
         <slot />
      </UMain>
   </div>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';
const route = useRoute();

/* *** */

const navigationItems = computed<NavigationMenuItem[]>(() => [
   {
      label: 'Dashboard',
      to: 'dashboard',
      active: /\/dashboard/.test(route.path),
   },
   {
      label: 'My courses',
      to: 'courses',
      active: /\/courses/.test(route.path),
   },
   {
      label: 'Notifications',
      to: 'notifications',
      active: /\/notifications/.test(route.path),
   },
]);
</script>

<style scoped></style>
