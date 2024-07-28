import { createWebHistory, createRouter } from "vue-router";
// 从"vue-router"中导入createWebHistory和createRouter方法

import routes from "./routes";
// 从"./routes"中导入路由配置

const router = createRouter({
  history: createWebHistory(),
  // 创建基于HTML5 history模式的history实例

  routes: routes
  // 设置路由配置
});

export default router;
// 导出路由