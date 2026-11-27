<template>
   <VLoginForm class="mt-4" @submit="onFormSubmit" @google-sign-in="onGoogleSignIn" />
</template>

<script setup lang="ts">
const toast = useToast();

/* *** */

function onFormSubmit() {
   toast.add({ title: "Login form submitted" });
}

function onGoogleSignIn() {
   toast.add({ title: "Google sign-in requested" });
}
</script>
