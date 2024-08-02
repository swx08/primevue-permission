<template>
  <div class="layout-aside">
    <Menu />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Menu from "./component/menu/Index.vue";
onMounted(() => { })

</script>
<style scoped lang='scss'>
.layout-aside {
  width: $base-aside-width;
  height: calc(100vh - ($base-header-padding * 2));
}

:deep(.v-sidebar-menu) {
  margin: $base-menu-margin;
  border-radius: $base-menu-border-radius;
}
</style>