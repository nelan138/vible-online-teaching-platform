<template>
   <div>
      <UHeader to="/homepage">
         <template #right>
            <UColorModeButton />
            <UButton icon="lucide:user-round" variant="link" color="neutral" @click="navigateTo('/profile/my_profile')"/>
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
