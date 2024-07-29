<template>
    <sidebar-menu :collapsed="collapsedStore.collapsed" :hideToggle="true" :menu="menuList" width="220px"
        :theme="themeStore.isSimple ? '' : 'white-theme'" @item-click="handlerClick"
        :style="{ background: themeStore.currentMenuBgColor }">
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
import useUserStore from "@/stores/models/user/user.js";

//控制菜单收缩
const userStore = useUserStore();
const collapsedStore = useCollapsedStore();
const route = useRoute();
const themeStore = useThemeStore();
const breadcrumbStore = useBreadcrumbStore();
const menuList = ref([]);

onMounted(() => {
    handlerMenuList();
})

//过滤出菜单路由，有子菜单的路由
const handlerMenuList = () => {
    const tempItem = userStore.menuRoutes.filter((item) => item.children);
    menuList.value = [...handlerOneChild(tempItem), ...handlerMoreChild(tempItem)];
};

//过滤只有一个子菜单的数据
const handlerOneChild = (tempItem) => {
    let oneChild = [];
    const hasOneChild = tempItem.filter((item) => item.children.length === 1);
    //一个子菜单处理
    hasOneChild.forEach((menuItem) => {
        oneChild.push({
            href: menuItem.children[0].path,
            title: menuItem.children[0].meta.title,
            icon: `pi ${menuItem.children[0].meta.icon}`,
            isActive: (item) => item.href === route.path ? true : false
        })
    });

    return oneChild;
}

//过滤有多个子菜单的数据
const handlerMoreChild = (tempItem) => {
    let moreChild = [];
    //多个子菜单处理
    const hasMoreChild = tempItem.filter((item) => item.children.length > 1);
    hasMoreChild.forEach((menu) => {
        var tempMenu = {
            title: '',
            icon: '',
            child: []
        };
        tempMenu.title = menu.meta.title;
        tempMenu.icon = `pi ${menu.meta.icon}`;
        menu.children.forEach((menuItem) => {
            tempMenu.child.push({
                href: menuItem.path,
                title: menuItem.meta.title,
                icon: `pi ${menuItem.meta.icon}`,
                isActive: (item) => item.href === route.path ? true : false
            })
        });
        moreChild.push(tempMenu);
    });

    return moreChild;
}

const items = ref([
    {
        href: '/home',
        title: '主面板',
        icon: 'pi pi-gauge',
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
                isActive: (item) => item.href === route.path ? true : false
            },
            {
                href: '/system/dict',
                title: '字典管理',
                icon: 'pi pi-box',
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
                isActive: (item) => item.href === route.path ? true : false
            },
            {
                href: '/permission/role',
                title: '角色管理',
                icon: 'pi pi-box',
                isActive: (item) => item.href === route.path ? true : false
            },
            {
                href: '/permission/menu',
                title: '菜单管理',
                icon: 'pi pi-box',
                isActive: (item) => item.href === route.path ? true : false
            }
        ]
    },
    {
        href: '/404',
        title: '404',
        icon: 'pi pi-arrow-circle-left',
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