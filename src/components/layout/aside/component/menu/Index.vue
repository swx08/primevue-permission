<template>
    <sidebar-menu :collapsed="collapsedStore.collapsed" :hideToggle="true" :menu="items" width="220px"
        :theme="themeStore.isSimple ? '' : 'white-theme'" @item-click="handlerClick">
        <template v-slot:header>
            <Logo />
            <Divider />
        </template>
    </sidebar-menu>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Logo from "@/components/layout/aside/component/logo/Index.vue";
//左侧菜单组件
import { SidebarMenu } from 'vue-sidebar-menu';
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css';
import { useCollapsedStore } from "@/stores/models/collapsed";
import { useBreadcrumbStore } from "@/stores/models/breadcrumb";
import { useRoute } from 'vue-router';
import { useThemeStore } from "@/stores/models/theme";

//控制菜单收缩
const collapsedStore = useCollapsedStore();
const route = useRoute();
const themeStore = useThemeStore();
const breadcrumbStore = useBreadcrumbStore();

onMounted(() => { })

const items = ref([
    {
        href: '/home',
        title: '主面板',
        icon: 'pi pi-gauge',
        exact: true,
        isActive: (item) => item.href === route.path ? true : false
    },
    {
        title: '系统管理',
        icon: 'pi pi-cog',
        child: [
            {
                href: '/system/notice',
                title: '公告管理',
                icon: 'pi pi-envelope',
                exact: true,
                isActive: (item) => item.href === route.path ? true : false
            },
            {
                href: '/system/dict',
                title: '字典管理',
                icon: 'pi pi-box',
                exact: true,
                isActive: (item) => item.href === route.path ? true : false
            }
        ]
    },
    {
        title: '权限管理',
        icon: 'pi pi-lock',
        child: [
            {
                href: '/permission/user',
                title: '用户管理',
                icon: 'pi pi-user',
                exact: true,
                isActive: (item) => item.href === route.path ? true : false
            },
            {
                href: '/permission/role',
                title: '角色管理',
                icon: 'pi pi-box',
                exact: true,
                isActive: (item) => item.href === route.path ? true : false
            },
            {
                href: '/permission/menu',
                title: '菜单管理',
                icon: 'pi pi-box',
                exact: true,
                isActive: (item) => item.href === route.path ? true : false
            }
        ]
    },
    {
        href: '/404',
        title: '404',
        icon: 'pi pi-arrow-circle-left',
        exact: true,
        isActive: (item) => item.href === route.path ? true : false
    },
]);

//添加路由面包屑
const handlerClick = (event, item) => {
    if (item.child === undefined) {
        breadcrumbStore.addBreadcrumb(item);
    }
}
</script>
<style scoped lang='scss'>
:deep(.p-divider-horizontal) {
    padding: 0;
    margin: 0 0 16px 0;
}
</style>