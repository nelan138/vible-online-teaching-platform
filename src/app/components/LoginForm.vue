<template>
   <UPageCard class="mx-auto my-8 w-full max-w-sm">
      <UAuthForm :fields="fields" :providers="providers">
         <template #password-hint>
            <NuxtLink class="text-primary text-link">forgot password?</NuxtLink>
         </template>

         <template #footer>
            <NuxtLink>
               Don't have an account?
               <span class="text-primary text-link">sign up here</span>
            </NuxtLink>
         </template>
      </UAuthForm>
   </UPageCard>
</template>

<script setup lang="ts">
import type { AuthFormField, ButtonProps } from '@nuxt/ui';

const toast = useToast();
const auth = useAuth();

/* *** */

const fields: AuthFormField[] = [
   {
      name: 'email',
      type: 'email',
      label: 'Email',
      placeholder: 'you@example.com',
      required: true,
   },
   {
      name: 'password',
      type: 'password',
      label: 'Password',
      placeholder: 'enter your password',
      required: true,
   },
];

const providers: ButtonProps[] = [
   {
      label: 'Login with Google',
      icon: 'i-simple-icons-google',
      loadingAuto: true,
      onClick: onGoogleSignIn,
   },
];

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

   if (loggedIn) return navigateTo('/user/dashboard', { replace: true });
});

async function onGoogleSignIn() {
   const [result, requestError] = await tryCatch(
      auth.signIn.social({
         provider: 'google',
         callbackURL: new URL('/', window.location.origin).href,
      })
   );

   const error = requestError ?? result?.error;

   if (error) {
      toast.add({
         title: 'Google sign-in failed',
         description: error.message || 'Please try again.',
         color: 'error',
      });
   }
}
</script>
