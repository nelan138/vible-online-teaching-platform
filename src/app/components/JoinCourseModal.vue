<template>
   <UModal title="Join a course">
      <template #body="{ close }">
         <UForm :state="state" :validate="validate" class="space-y-4" @submit="submit">
            <UFormField label="Invite code" name="inviteCode" required>
               <UInput v-model="state.inviteCode" class="w-full" />
            </UFormField>

            <div class="flex justify-end gap-2">
               <UButton type="button" label="Cancel" color="neutral" variant="outline" @click="close()" />
               <UButton type="submit" label="Join" />
            </div>
         </UForm>
      </template>
   </UModal>
</template>

<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '@nuxt/ui';

/* *** */

const emit = defineEmits<{ close: [inviteCode: string] }>();
const state = reactive({ inviteCode: '' });

function validate(data: typeof state): FormError[] {
   return data.inviteCode.trim() ? [] : [{ name: 'inviteCode', message: 'Enter an invite code.' }];
}

function submit({ data }: FormSubmitEvent<typeof state>) {
   emit('close', data.inviteCode.trim());
}
</script>
