<template>
    <div class="container">
        <div class="collapsed">
            <Button @click="handleCollapsedStatus" icon="pi pi-angle-double-left" text rounded
                v-if="!collapsedStore.collapsed" severity="secondary" />
            <Button @click="handleCollapsedStatus" icon="pi pi-angle-double-right" text rounded v-else
                severity="secondary" />
        </div>
        <div class="breadcrumb">
            <BreadCrumb />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCollapsedStore } from "@/stores/models/collapsed";
import BreadCrumb from "@/components/common/breadcrumb/Index.vue";

//控制菜单收缩
const collapsedStore = useCollapsedStore();

onMounted(() => { })

//修改菜单栏收缩状态
const handleCollapsedStatus = () => {
    collapsedStore.collapsed = !collapsedStore.collapsed;
}
</script>
<style scoped lang='scss'>
.container{
    display: flex;
    align-items: center;

    .breadcrumb{
        width: 800px;
    }
}
</style>