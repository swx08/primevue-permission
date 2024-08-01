<template>
  <Breadcrumb :model="breadcrumbStore.breadcrumbs">
    <template #item="{ item }">
      <router-link v-if="item.href" :to="item.href">
        <Button
          size="small"
          :label="item.title"
          :icon="item.icon"
          :severity="route.path === item.href ? 'success' : 'secondary'"
          text
        />
      </router-link>
    </template>
  </Breadcrumb>
</template>

<script setup>
import { ref } from "vue";
import { useBreadcrumbStore } from "@/stores/models/breadcrumb";
import Button from "primevue/button";
import { useRoute } from "vue-router";

const route = useRoute();
console.log(route)
const breadcrumbStore = useBreadcrumbStore();
</script>

<style scoped lang='scss'>
.p-breadcrumb {
  padding: 5px;
}
</style>
