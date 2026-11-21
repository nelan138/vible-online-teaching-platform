<template>
   <UContainer>
      <AuthForm :form="{ fields, providers }">
         <template #password-hint>
            <Description class="text-primary hover:underline"> Forgot password? </Description>
         </template>

         <template #footer>
            <p class="text-center text-sm text-muted">
               Don't have an account?
               <span class="text-primary hover:underline"> Sign up </span>
            </p>
         </template>
      </AuthForm>
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
         callbackURL: new URL('/account/login', window.location.origin).href,
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
