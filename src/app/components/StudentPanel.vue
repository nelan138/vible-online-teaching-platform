<template>
   <FloatingPanel v-slot="{ close }">
      <UButton
         icon="lucide:plus-square"
         label="Join a course"
         aria-haspopup="dialog"
         @click="openJoinCourseModal(close)"
      />

      <UButton
         icon="lucide:square-arrow-left-exit"
         label="Log out"
         loading-auto
         color="warning"
         @click="logOut"
      />
   </FloatingPanel>
</template>

<script setup lang="ts">
import { LazyJoinCourseModal } from '#components';

/* *** */

const joinCourseModal = useModal(LazyJoinCourseModal);

async function openJoinCourseModal(close: () => Promise<void>) {
   await close();
   void joinCourseModal.open();
}
</script>
