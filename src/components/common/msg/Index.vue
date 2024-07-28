<template>
    <span>
        <Button v-tooltip.bottom="'消息'" icon="pi pi-bell" text rounded @click="handleMessage" severity="secondary" />
    </span>

    <!-- 消息内容 -->
    <Drawer v-model:visible="visibleRight" header="消息列表" style="width: 400px;" position="right">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
            magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
            commodo consequat.</p>
    </Drawer>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const visibleRight = ref(false);
onMounted(() => {})

const handleMessage = () => {
    visibleRight.value = true;
}
</script>
<style scoped lang='scss'>
</style>