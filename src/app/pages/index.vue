<template>
   <div>Verifying. . .</div>
</template>

<script setup lang="ts">
const toast = useToast();

onMounted(async () => {
   const [data, error] = await tryCatch(userIsLoggedIn());

   if (error) {
      toast.add({
         title: 'Could not verify your session',
         description: error.message || 'Please try again.',
         color: 'error',
      });
      return;
   }

   return navigateTo(data ? '/user/dashboard' : '/account/login');
});
</script>
