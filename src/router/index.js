// 从"vue-router"中导入createWebHistory和createRouter方法
import { createWebHistory, createRouter } from "vue-router";
import useUserStore from "@/stores/models/user/user.js";
import pinia from "@/stores";

const userStore = useUserStore(pinia);
const router = createRouter({
  // 创建基于HTML5 history模式的history实例
  history: createWebHistory(),
  // 设置路由配置
  routes: userStore.menuRoutes,
  scrollBehavior(to, from, savedPosition) {
    // 始终滚动到顶部
    return { top: 0 };
  },
});

// 导出路由
export default router;
