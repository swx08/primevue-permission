<template>
  <Card>
    <template #content>
      <DataTable :value="customers">
        <Column field="id" header="Id" footer="Id" style="min-width: 100px"></Column>
        <Column field="name" header="Name" footer="Name" style="min-width: 200px"></Column>
        <Column field="country.name" header="Country" footer="Country" style="min-width: 200px"></Column>
        <Column field="date" header="Date" footer="Date" style="min-width: 200px"></Column>
        <Column field="balance" header="Balance" footer="Balance" style="min-width: 200px">
          <template #body="{ data }">
            {{ formatCurrency(data.balance) }}
          </template>
        </Column>
        <Column field="company" header="Company" footer="Company" style="min-width: 200px"></Column>
        <Column field="status" header="Status" footer="Status" style="min-width: 200px"></Column>
      </DataTable>
    </template>
  </Card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
// import { CustomerService } from '@/service/CustomerService';
import { roleData } from '@/assets/data/roleData';

const customers = ref(roleData);

onMounted(() => {
});

const formatCurrency = (value) => {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};
</script>
