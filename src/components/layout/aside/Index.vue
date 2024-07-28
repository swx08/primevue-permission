<template>
  <div class="layout-aside">
    <Menu :class="{ darkMode: themeStore.isSimple ? true : false }" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Menu from "./component/menu/Index.vue";
import { useThemeStore } from "@/stores/models/theme";

const themeStore = useThemeStore();
onMounted(() => { })

</script>
<style scoped lang='scss'>
.layout-aside {
  width: $base-aside-width;
  height: calc(100vh - $base-header-padding * 2);
}

:deep(.v-sidebar-menu) {
  margin: 16px 0 16px 0;
  border-radius: 0 12px 12px 0;

  &.darkMode {
    background-color: #18181b;
  }
}
</style>