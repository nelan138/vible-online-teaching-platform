<template>
   <div class="grid min-h-[calc(100dvh-var(--ui-header-height))] place-items-center px-4">
      <div role="status" class="w-full max-w-48 space-y-3 text-center">
         <p class="text-sm text-muted">Signing you in…</p>
         
         <UProgress size="sm" aria-hidden="true" />
      </div>
   </div>
</template>

<script setup lang="ts">
definePageMeta({
   layout: 'account',
   middleware: 'authenticate-user',
});

/* *** */

onMounted(() => navigateTo('/user/dashboard'));
</script>
