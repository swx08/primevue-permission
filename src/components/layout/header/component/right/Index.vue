<template>
    <div class="header-right">
        <Message />
        <span>
            <Button v-tooltip.bottom="'刷新'" icon="pi pi-refresh" text rounded @click="handleDoRefresh"
                severity="secondary" />
        </span>
        <span>
            <Toast />
            <Button v-tooltip.bottom="'全屏'" icon="pi pi-expand" text rounded @click="handleChangeScreen"
                severity="secondary" size="small" />
        </span>
        <span>
            <Button icon="pi pi-user" severity="secondary" rounded text @click="toggle">
                <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/onyamalimba.png" shape="circle" />
            </Button>
            <Menu ref="menu" id="config_menu" :model="items" popup>
                <template #item="{ item, props }">
                    <a v-ripple class="flex items-center" v-bind="props.action" @click="handler(item)">
                        <span :class="item.icon" />
                        <span>{{ item.label }}</span>
                    </a>
                </template>
            </Menu>
        </span>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRefreshStore } from "@/stores/models/refresh";
import { useToast } from "primevue/usetoast";
import screenfull from "screenfull";
import Message from "@/components/common/msg/Index.vue";

const toast = useToast();
const useRefresh = useRefreshStore();
const menu = ref(null);
const items = ref([
    {
        label: '个人中心',
        icon: 'pi pi-user'
    },
    {
        label: '退出登录',
        icon: 'pi pi-power-off'
    }
]);

const toggle = (event) => {
    menu.value.toggle(event);
};

const handler = (item) => {
    console.log(item)
};
onMounted(() => { })

// 刷新
const handleDoRefresh = () => {
    useRefresh.refresh = !useRefresh.refresh;
}

// 切换全屏
const handleChangeScreen = () => {
    if (screenfull.isEnabled) {
        //可以来回切换全屏/非全屏
        screenfull.toggle();
    } else {
        toast.add({ severity: 'error', summary: '您的浏览器不支持全屏！' });
    }
}
</script>
<style scoped lang='scss'>
.header-right {
    display: flex;
    align-items: center;
    height: 64px;
}

.header-right span {
    margin: 0 10px 0 10px;
}
</style>