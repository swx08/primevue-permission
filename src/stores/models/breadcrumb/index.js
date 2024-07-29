// 导入pinia库中的defineStore函数和vue库中的ref函数
import { defineStore } from "pinia";
import { ref } from "vue";

// 定义Breadcrumb模块的store
export const useBreadcrumbStore = defineStore("breadcrumb", () => {
  // 使用ref创建响应式的breadcrumb变量，并初始化为null
  const breadcrumbs = ref([
    {
      href: "/home",
      title: "首页",
      icon: "pi pi-gauge",
      exact: true,
      isActive: (item) => (item.href === route.path ? true : false),
    }
  ]);

  // 定义一个addBreadcrumb方法，用于添加面包屑
  const addBreadcrumb = (breadcrumb) => {
    // 判断breadcrumb是否为空，如果为空则直接返回
    if (!breadcrumb) return;

    // 如果breadcrumbs中已经存在该面包屑，则直接返回
    const breadcrumbIndex = breadcrumbs.value.findIndex(
      (item) => item.title === breadcrumb.title
    );

    if (breadcrumbIndex !== -1) {
      // 如果找到的是'主面板'，且breadcrumbs长度大于1，则删除之后的所有面包屑
      if (breadcrumb.title === "首页" && breadcrumbs.value.length > 1) {
        breadcrumbs.value.splice(breadcrumbIndex + 1);
      }
      // 如果不是'主面板'，则直接返回，因为不需要添加重复的面包屑
      return;
    }

    if (breadcrumbs.value.length <= 6) {
      // 如果breadcrumbs长度小于6，则直接添加到breadcrumbs中
      breadcrumbs.value.push(breadcrumb);
    }
  };
  
  return {
    breadcrumbs,
    addBreadcrumb,
  };
});
