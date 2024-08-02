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
  height: 100vh;
}

:deep(.v-sidebar-menu) {
  &.darkMode {
    background-color: #18181b;
  }
}
</style>