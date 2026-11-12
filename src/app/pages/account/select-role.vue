<template>
   <UContainer>
      <div class="w-full mx-auto h-fit my-14 max-w-3xl border-2 border-muted rounded-sm">
         <div class="space-y-4 p-8 flex flex-col gap-4">
            <h2 class="text-lg font-semibold">Choose your role</h2>
            
            <UFormField label="Role" required>
               <USelect v-model="selectedRole" :items="roles" placeholder="Select a role" class="w-full" />
            </UFormField>

            <UButton :disabled="!selectedRole || !accountId" :loading="savingRole" block @click="saveRole">
               Continue
            </UButton>
         </div>
      </div>
   </UContainer>
</template>

<script setup lang="ts">

const auth = useAuth();
const toast = useToast();
type Role = 'student' | 'teacher';
const savingRole = ref(false);
const accountId = ref('');
const selectedRole = ref<Role>();
const roles = [
   { label: 'Student', value: 'student' },
   { label: 'Teacher', value: 'teacher' },
];

onMounted(async () => {
   const [, error] = await tryCatch(loadAccount());

   if (error) {
      toast.add({ title: 'Could not load your account', description: 'Please reload and try again.', color: 'error' });
   }
});

async function loadAccount() {
   const { data, error } = await auth.getSession();
   if (error) throw new Error('Could not check your session.');

   if (!data?.user) {
      await navigateTo('/account/login');
      return;
   }

   const [user, userError] = await tryCatch($fetch<UserRecord | null>(`/api/users/${data.user.id}`));

   if (userError) throw userError;

   if (!user) {
      await navigateTo('/account/login');
      return;
   }

   if (user.user_role) {
      await navigateTo('/user/dashboard');
      return;
   }

   accountId.value = data.user.id;
}

async function saveRole() {
   if (!selectedRole.value || !accountId.value || savingRole.value) return;
   savingRole.value = true;

   const [, error] = await tryCatch(persistRole());
   savingRole.value = false;

   if (error) {
      toast.add({ title: 'Could not save your role', description: 'Please try again.', color: 'error' });
   }
}

async function persistRole() {
   await $fetch(`/api/users/${accountId.value}`, {
      method: 'PATCH',
      body: { user_role: selectedRole.value },
   });
   toast.add({ title: 'Role saved', description: `You selected ${selectedRole.value}.`, color: 'success' });
   await navigateTo('/user/dashboard');
}
</script>
