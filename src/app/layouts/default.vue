<template>
   <div>
      <VHeader title="Vible" @switch-user="switchUser" />

      <UMain :key="userStore.user.id">
         <slot />
      </UMain>

      <VFooter />
   </div>
</template>

<script setup lang="ts">
const route = useRoute();
const userStore = useUserStore();

async function switchUser() {
   if (route.name === "courses-id") await navigateTo("/user/dashboard");
   userStore.switchUser();
   route.meta.user = userStore.user;
}
</script>
