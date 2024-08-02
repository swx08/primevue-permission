<template>
  <Card class="layout-header" :class="{ collapsed: collapsedStore.collapsed ? true : false }">
    <template #content>
      <div class="header-content">
        <Collapsed />
        
        <header-right />
      </div>
    </template>
  </Card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Collapsed from "@/components/layout/header/component/collapsed/Index.vue";
import HeaderRight from "@/components/layout/header/component/right/Index.vue";
import { useCollapsedStore } from "@/stores/models/collapsed";

//控制菜单收缩
const collapsedStore = useCollapsedStore();

onMounted(() => { })
</script>
<style scoped lang='scss'>
.layout-header {
  height: $base-header-height;
  width: calc(100vw - $base-aside-width);
  transition: all 0.3s;

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: $base-header-height;
  }

  &.collapsed {
    width: calc(100vw - $base-aside-collapsed-width);
    transition: all 0.3s;
  }
}

:deep(.p-card-body) {
  padding: 0;
}

.p-card {
  border-radius: 0;
}
</style>