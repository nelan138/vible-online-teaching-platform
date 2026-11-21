<template>
   <div>
      <UHeader>
         <template #left>
            <NuxtLink to="/user/dashboard" class="shrink-0 font-bold text-xl text-highlighted me-4"> Vible </NuxtLink>

            <UNavigationMenu :items="navigationItems" variant="link" />
         </template>

         <template #right>
            <UButton icon="lucide:bell" variant="ghost" color="neutral" />

            <UColorModeButton />

            <UButton icon="lucide:user" variant="ghost" color="neutral" aria-label="Profile" disabled />
         </template>
      </UHeader>

      <UMain>
         <PageHero v-if="route.meta.showUserHero" />

         <CourseSidebar v-if="route.meta.showCourseSidebar" />

         <slot />

         <StudentPanel v-if="userRole === 'student'" />
         <TeacherPanel v-else-if="userRole === 'teacher'" />
      </UMain>
   </div>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';

const route = useRoute();
const userStore = useUserStore();

/* *** */

const userRole = computed(() => userStore.user?.role);

const navigationItems = computed<NavigationMenuItem[]>(() => [
   {
      label: 'Dashboard',
      to: '/user/dashboard',
      active: route.path.startsWith('/user/dashboard'),
   },
   {
      label: 'My courses',
      to: '/user/courses',
      active: route.path.startsWith('/user/courses'),
   },
   {
      label: 'Notifications',
      disabled: true,
   },
]);
</script>

<style scoped></style>
