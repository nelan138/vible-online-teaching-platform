<template>
   <AccountForm :form="{ fields, providers }" :image="image">
      <template #password-hint>
         <NuxtLink class="text-xs text-primary font-medium hover:underline"> Forgot password? </NuxtLink>
      </template>

      <template #footer>
         <p class="text-center text-sm text-muted">
            Don't have an account?
            <NuxtLink class="text-primary font-medium hover:underline"> Sign up </NuxtLink>
         </p>
      </template>
   </AccountForm>
</template>

<script setup lang="ts">
import type { AuthFormField, ButtonProps } from '@nuxt/ui';

const { image = false } = defineProps<{
   image?: string | false;
}>();

const toast = useToast();
const auth = useAuth();

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
      placeholder: '••••••••',
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
