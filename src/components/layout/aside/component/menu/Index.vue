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
        if (!menuItem.children[0].meta.hidden) {
            oneChild.push({
                href: menuItem.children[0].path,
                title: menuItem.children[0].meta.title,
                icon: `pi ${menuItem.children[0].meta.icon}`,
                isActive: (item) => item.href === route.path ? true : false
            })
        }
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
            if (!menuItem.meta.hidden) {
                tempMenu.child.push({
                    href: menuItem.path,
                    title: menuItem.meta.title,
                    icon: `pi ${menuItem.meta.icon}`,
                    isActive: (item) => item.href === route.path ? true : false
                })
            }
        });
        moreChild.push(tempMenu);
    });

    return moreChild;
}

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