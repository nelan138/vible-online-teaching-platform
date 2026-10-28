<template>
   <div>
      <UTable :data="data" :columns="columns" class="flex-1">
         <template #actions-cell>
            <div class="flex justify-end">
               <UButton icon="lucide:ellipsis-vertical" color="neutral" variant="ghost" size="xs" />
            </div>
         </template>
      </UTable>

      <div class="flex justify-center mt-4">
         <UPagination :page="1" :total="10" active-color="primary" active-variant="subtle" />
      </div>
   </div>
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui';

definePageMeta({
   layout: 'course',
});

interface Participant {
   name: string;
   email: string;
   role: string;
}

const data: Participant[] = [
   {
      name: 'Nguyen Van A',
      email: 'nguyen_van_a@example.com',
      role: 'Teacher',
   },
   {
      name: 'Student 1',
      email: 'student_1@example.com',
      role: 'Student',
   },
   {
      name: 'Student 2',
      email: 'student_2@example.com',
      role: 'Student',
   },
   {
      name: 'Student 3',
      email: 'student_3@example.com',
      role: 'Student',
   },
];

const columns: TableColumn<Participant>[] = [
   { accessorKey: 'name', header: 'Name' },
   { accessorKey: 'email', header: 'Email' },
   { accessorKey: 'role', header: 'Role' },
   { id: 'actions', header: '' },
];
</script>

<style scoped></style>
