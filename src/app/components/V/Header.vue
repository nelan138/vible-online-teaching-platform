<template>
   <UHeader :title="title" to="/">
      <template #right>
         <UButton icon="lucide:bell" />

         <UColorModeButton />

         <UDropdownMenu
            :content="{
               align: 'end',
               side: 'bottom',
            }"
         >
            <UButton icon="lucide:user" class="border rounded-full p-1" />

            <template #content-bottom>
               <!-- ONLY FOR DEBUGGING, REMOVE LATER  -->
               <UButton
                  icon="lucide:arrow-left-right"
                  label="Switch user"
                  color="error"
                  @click="emit('switch-user')"
               />

               <UButton icon="lucide:log-out" label="Sign out" disabled />

               <UButton
                  icon="lucide:arrow-up-right-from-circle"
                  label="My profile"
                  disabled
               />
            </template>
         </UDropdownMenu>
      </template>

      <UNavigationMenu :items="navigationItems" variant="link" />
   </UHeader>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const emit = defineEmits<{ "switch-user": [] }>();

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
