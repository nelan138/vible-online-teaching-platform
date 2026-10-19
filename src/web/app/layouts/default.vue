<template>
   <div>
      <UHeader />

      <UMain>
         <UContainer>
            <slot />
         </UContainer>
      </UMain>

      <UFooter />
   </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
