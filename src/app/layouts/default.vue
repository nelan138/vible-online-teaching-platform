<template>
   <div>
      <VHeader title="Vible" @switch-user="switchUser" />

      <UMain :key="user.id">
         <slot />
      </UMain>

      <VFooter />
   </div>
</template>

<script setup lang="ts">
import type { User } from "#shared/types/user";
import { student, teacher } from "~/data/temp/user";

const route = useRoute();
const user = useState<User>("mock-user", () => ({ ...teacher }));

async function switchUser() {
   if (route.name === "courses-id") await navigateTo("/user/dashboard");
   user.value = { ...(user.value.role === "teacher" ? student : teacher) };
   route.meta.user = user.value;
}
</script>
