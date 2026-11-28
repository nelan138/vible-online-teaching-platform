<template>
   <div>
      <VHeader title="Vible" @switch-user="switchUser" />

      <UMain>
         <slot />
      </UMain>

      <VFooter />
   </div>
</template>

<script setup lang="ts">
import { student, teacher } from "~/data/temp/user";

const user = useState<User>("debug-user", () => teacher);

/* *** */

async function switchUser() {
   user.value = user.value.role === "teacher" ? student : teacher;
   await navigateTo("/");
}
</script>
