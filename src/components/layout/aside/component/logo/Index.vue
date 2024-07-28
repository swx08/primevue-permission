<template>
    <div class="logo">
        <svg-icon v-if="!Setting
            .logoHidden" :name="Setting.logoName" width="32px" height="32px"></svg-icon>
        <svg-icon v-else-if="collapsedStore.collapsed" :name="Setting.logoName" width="32px" height="32px"></svg-icon>
        <span :class="{ darkMode: themeStore.isSimple ? true : false }" v-if="!collapsedStore.collapsed">{{ Setting
            .title }}</span>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCollapsedStore } from "@/stores/models/collapsed";
import { useThemeStore } from "@/stores/models/theme";
import Setting from "@/setting";

const themeStore = useThemeStore();
//控制菜单收缩
const collapsedStore = useCollapsedStore();
onMounted(() => { })

</script>
<style scoped lang='scss'>
.logo {
    height: $base-header-height;
    padding: $base-header-padding;
    display: flex;
    align-items: center;
    font-size: 18px;
    font-weight: 700;
    overflow: hidden;
}

.logo span {
    flex-shrink: 0;
    margin-left: 8px;
    color: black;

    &.darkMode {
        color: #fff;
    }
}
</style>