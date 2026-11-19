<template>
   <div>
      <UHeader title="Vible" to="">
         <template #right>
            <UColorModeButton />
         </template>
      </UHeader>

      <UMain>
         <slot />
      </UMain>
   </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
