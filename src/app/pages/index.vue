<template>
   <div>Verifying. . .</div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'account' });

const toast = useToast();

onMounted(async () => {
   const [loggedIn, logInError] = await tryCatch(userIsLoggedIn());

   if (logInError) {
      toast.add({
         title: 'Could not verify your session',
         description: logInError.message || 'Please try again.',
         color: 'error',
      });
      return;
   }

   if (!loggedIn) return navigateTo('/account/login');

   const [setUp, setUpError] = await tryCatch(userSetupIsComplete());

   if (setUpError) {
      toast.add({
         title: 'Could not verify your account setup',
         description: setUpError.message || 'Please try again.',
         color: 'error',
      });
      return;
   }

   return navigateTo(setUp ? '/user/dashboard' : '/user/setup');
});
</script>
