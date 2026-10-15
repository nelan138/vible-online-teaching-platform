<template>
   <div>
      <UHeader>
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
