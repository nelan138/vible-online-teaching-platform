<template>
   <div>
      <UHeader title="Vible" to="/">
         <template #right>
            <UColorModeButton />
         </template>
      </UHeader>

      <UMain>
         <UContainer>
            <slot />
         </UContainer>
      </UMain>

      <UFooter>
         <template #left>
            <p class="text-sm">Vible. All rights reserved.</p>
         </template>

         <template #right>
            <UButton label="About" variant="link" color="neutral" />
            <UButton label="Terms" variant="link" color="neutral" />
            <UButton label="Privacy" variant="link" color="neutral" />
            <UButton label="Contact" variant="link" color="neutral" />
         </template>
      </UFooter>
   </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
