<template>
   <VRegisterForm class="mt-4" @submit="onFormSubmit" @google-sign-up="onGoogleSignUp" />
</template>

<script setup lang="ts">
const toast = useToast();

function onFormSubmit() {
   toast.add({ title: "Registration form submitted" });
}

function onGoogleSignUp() {
   toast.add({ title: "Google sign-up requested" });
}
</script>
