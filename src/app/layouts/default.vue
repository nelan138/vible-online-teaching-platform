<template>
   <div>
      <UHeader to="/homepage">
         <template #left>
            <ULink to="/homepage" class="shrink-0 font-bold text-xl text-highlighted flex items-end gap-1.5">
               Nuxt UI
            </ULink>

            <UNavigationMenu :items="items" class="hidden lg:flex ml-4" variant="link" />
         </template>

         <template #right>
            <UButton icon="lucide:calendar-clock" variant="ghost" color="neutral" to="/search" />
            <UButton icon="lucide:bell" variant="ghost" color="neutral" to="/search" />
            <UButton icon="lucide:search" variant="ghost" color="neutral" to="/search" />
            <UColorModeButton />
            <UButton icon="i-lucide-user-round" variant="ghost" color="neutral" to="/profile/my_profile" />
         </template>
      </UHeader>

      <UMain>
         <slot />
      </UMain>

      <UFooter />
   </div>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';

const items = computed<NavigationMenuItem[]>(() => [
   {
      label: 'Homepage',
      to: '/homepage',
   },
   {
      label: 'My courses',
      to: '/courses',
   },
]);
</script>

<style scoped></style>
