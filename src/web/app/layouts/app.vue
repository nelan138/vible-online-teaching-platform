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
      to: '/dashboard',
      active: route.path.startsWith('/dashboard'),
   },
   {
      label: 'My Courses',
      to: '/courses',
      active: route.path.startsWith('/courses'),
   },
   {
      label: 'Notifications',
      to: '/notifications',
      active: route.path.startsWith('/notifications'),
   },
]);
</script>

<style scoped></style>
