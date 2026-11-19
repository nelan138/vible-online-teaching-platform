<template>
   <UContainer>
      <FormAuth :form="{ fields, providers }">
         <template #password-hint>
            <Description class="text-primary hover:underline"> Forgot password? </Description>
         </template>

         <template #footer>
            <p class="text-center text-sm text-muted">
               Don't have an account?
               <Description class="inline text-primary hover:underline"> Sign up </Description>
            </p>
         </template>
      </FormAuth>
   </UContainer>
</template>

<script setup lang="ts">
import type { AuthFormField, ButtonProps } from '@nuxt/ui';

definePageMeta({ layout: 'account' });

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

async function onGoogleSignIn() {
   const [, error] = await tryCatch(
      auth.signIn.social({
         provider: 'google',
         callbackURL: new URL('/account/login', window.location.origin).href,
      })
   );

   if (error) {
      toast.add({
         title: 'Google sign-in failed',
         description: error.message || 'Please try again.',
         color: 'error',
      });
   }
}
</script>
