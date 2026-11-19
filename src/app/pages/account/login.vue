<template>
   <UContainer>
      <AccountSignInForm image="/images/3t.jpeg" />
   </UContainer>
</template>

<script setup lang="ts">
const toast = useToast();

onMounted(async () => {
   const [loggedIn, logInError] = await tryCatch(userIsLoggedIn());
   if (logInError || !loggedIn) return;

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
