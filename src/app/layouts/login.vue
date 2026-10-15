<template>
   <div>
      <UHeader title="Vible" to="/login">
         <template #right>
            <UColorModeButton />
         </template>
      </UHeader>

      <UMain>
         <slot />
      </UMain>

      <UFooter />
   </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
