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
            <div @click="toggle">
                <Button icon="pi pi-user" severity="secondary" rounded text>
                    <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/onyamalimba.png" shape="circle" />
                </Button>
                <span>Admin</span>
            </div>
            <Menu ref="menu" id="config_menu" :model="items" popup />
        </span>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRefreshStore } from "@/stores/models/refresh";
import { toast } from "vue3-toastify";
import screenfull from "screenfull";
import Message from "@/components/common/msg/Index.vue";
import useUserStore from "@/stores/models/user/user.js";
import { doLogout } from '@/api/user';

const userStore = useUserStore();
const useRefresh = useRefreshStore();
const menu = ref(null);
const items = ref([
    {
        label: '个人中心',
        icon: 'pi pi-user',
        command: () => {
            toast.success("个人中心");
        }
    },
    {
        label: '退出登录',
        icon: 'pi pi-power-off',
        command: () => {
            doLogout().then((res) => {
                if (res.code === 200) {
                    userStore.logout();
                    toast.success("退出成功！");
                }
            })
        }
    }
]);

const toggle = (event) => {
    menu.value.toggle(event);
};
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

.header-right span:nth-last-child(1)>div {
    display: flex;
    align-items: center;
}

.btn {
    width: 100%;
    display: flex;
    justify-content: flex-start;
}
</style>