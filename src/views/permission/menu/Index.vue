<template>
  <DataTable :value="customers">
    <Column field="name" header="Name" style="min-width: 200px" frozen class="font-bold"></Column>
    <Column field="id" header="Id" style="min-width: 100px"></Column>
    <Column field="country.name" header="Country" style="min-width: 200px"></Column>
    <Column field="date" header="Date" style="min-width: 200px"></Column>
    <Column field="company" header="Company" style="min-width: 200px"></Column>
    <Column field="status" header="Status" style="min-width: 200px"></Column>
    <Column field="activity" header="Activity" style="min-width: 200px"></Column>
    <Column field="representative.name" header="Representative" style="min-width: 200px"></Column>
    <Column field="balance" header="Balance" style="min-width: 200px" alignFrozen="right" :frozen="balanceFrozen">
      <template #body="{ data }">
        <span class="font-bold">{{ formatCurrency(data.balance) }}</span>
      </template>
    </Column>
  </DataTable>
</template>

<script setup>
import { ref, onMounted } from 'vue';
// import { CustomerService } from '@/service/CustomerService';
import { menuData } from '@/assets/data/menuData';

const customers = ref(menuData);
onMounted(() => {
});

const balanceFrozen = ref(false);
const formatCurrency = (value) => {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};
</script>
