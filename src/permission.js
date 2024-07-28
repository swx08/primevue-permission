//路由鉴权文件
import router from "./router";
//引入nprogress进度条
import nprogress from "nprogress";
//引入全局配置
import setting from "./setting.js";
//引入nprogress样式
import "nprogress/nprogress.css";
// import { useTokenStore } from "@/stores/models/token/token.js";
nprogress.configure({ showSpinner: false });

//全局前置路由
router.beforeEach((to, from, next) => {
  //切换浏览器标题
  document.title = `${setting.title} - ${to.meta.title}`;
  //进度条开始动
  nprogress.start();
  //获取token判断用户是否登录
  //useTokenStore必须放在这里初始化否则持久化失效
  next();
  // const tokenStore = useTokenStore();
  // let token = tokenStore.token;
  // if (token) {
  //   //用户已登录
  //   if (to.path === "/login") {
  //     next("/");
  //   } else {
  //     //可以做一些token过期的处理逻辑
  //     next();
  //   }
  // } else {
  //   //用户未登录
  //   if (to.path === "/login") {
  //     next();
  //   } else {
  //     next({ path: "/login"});
  //   }
  // }
});

//全局后置路由
router.afterEach((to, from) => {
  //进度条结束
  nprogress.done();
});
