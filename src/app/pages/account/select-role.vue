<template>
   <UContainer>
      <div class="grid grid-cols-[auto_1fr] w-full mx-auto h-fit my-14 max-w-3xl border-2 border-muted rounded-sm">
         <PlaceHolder class="h-full aspect-3/4" text="Image here" />

         <div class="p-12">
            <p v-if="checkingSession" role="status">Checking your session…</p>

            <div v-else class="space-y-4">
               <h2 class="text-lg font-semibold">Choose your role</h2>
               <UFormField label="Role" required>
                  <USelect v-model="selectedRole" :items="roles" placeholder="Select a role" class="w-full" />
               </UFormField>
               <UButton :disabled="!selectedRole || !accountId" :loading="savingRole" block @click="saveRole">
                  Continue
               </UButton>
            </div>
         </div>
      </div>
   </UContainer>
</template>

<script setup lang="ts">
const auth = useAuth();
const toast = useToast();
type Role = 'student' | 'teacher';
type UserRecord = { user_id: string; account_id: string; user_role: Role | null };

const checkingSession = ref(true);
const savingRole = ref(false);
const accountId = ref('');
const selectedRole = ref<Role>();
const roles = [
   { label: 'Student', value: 'student' },
   { label: 'Teacher', value: 'teacher' },
];

onMounted(async () => {
   const [, error] = await tryCatch(loadAccount());
   checkingSession.value = false;

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

   const response = await $fetch.raw<UserRecord>(`/api/users/${encodeURIComponent(data.user.id)}`, {
      ignoreResponseError: true,
   });

   if (response.status === 404) {
      await navigateTo('/account/login');
      return;
   }

   if (!response.ok || !response._data) throw new Error('Could not load your user record.');

   if (response._data.user_role === 'student' || response._data.user_role === 'teacher') {
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
   await $fetch(`/api/users/${encodeURIComponent(accountId.value)}`, {
      method: 'PATCH',
      body: { user_role: selectedRole.value },
   });
   toast.add({ title: 'Role saved', description: `You selected ${selectedRole.value}.`, color: 'success' });
   await navigateTo('/user/dashboard');
}
</script>
