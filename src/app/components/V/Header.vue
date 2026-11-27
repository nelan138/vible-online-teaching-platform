<template>
   <UHeader :title="title" to="/">
      <template #right>
         <UButton icon="lucide:bell" />

         <UColorModeButton />

         <UButton icon="lucide:user" class="border rounded-full p-1" />
      </template>

      <UNavigationMenu :items="navigationItems" variant="link" />
   </UHeader>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

defineProps<{
   title: string;
}>();

const route = useRoute();

function isActive(path: string) {
   return route.path === path || route.path.startsWith(path + "/");
}

const navigationItems = computed<NavigationMenuItem[]>(() => [
   {
      label: "Dashboard",
      to: "/user/dashboard",
      active: isActive("/user/dashboard"),
   },
   {
      label: "Courses",
      to: "/user/courses",
      active: isActive("/user/courses"),
   },
   {
      label: "Notifications",
      disabled: true,
   },
   {
      label: "Profile",
      disabled: true,
   },
]);

/* *** */
</script>
