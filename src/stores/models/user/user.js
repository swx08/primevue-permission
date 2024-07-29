// 导入定义 store 的函数和 ref 函数
import { defineStore } from "pinia";
import router from "@/router";
// 导入常量路由配置
import { constantRoutes, asyncRoutes, anyRoutes } from "@/router/routes.js";
//引入lodash深拷贝函数
import cloneDeep from "lodash/cloneDeep";
// import { login, getUserInfo, doEmailLogin, doLogout } from "@/api/user";
import { doLogin, getUserInfo } from "@/api/user";
import { SET_TOKEN, REMOVE_TOKEN } from "@/stores/models/token/token.js";

//用于过滤当前用户需要展示的异步路由
const filterAsyncRoute = (asyncRoute, route) => {
  return asyncRoute.filter((item) => {
    if (route.includes(item.name)) {
      if (item.children && item.children.length > 0) {
        item.children = filterAsyncRoute(item.children, route);
      }
      return true;
    }
  });
};

// 定义名为 useUserStore 的 store
let useUserStore = defineStore("User", {
  state: () => {
    return {
      token: localStorage.getItem("TOKEN"),
      menuRoutes: constantRoutes,
      user: {
        userId: null,
        username: "",
      },
      permissions: [],
      loginStatus: false
    };
  },

  actions: {
    //密码登录方法
    async handlerLogin(user) {
      let res = await doLogin(user);
      if (res.code === 200) {
        this.token = res.data;
        //本地存储token
        SET_TOKEN(res.data);
        return res;
      } else {
        return Promise.reject(new Error(res.message));
      }
    },

    //邮箱登录方法
    // async emailLogin(user) {
    //   let res = await doEmailLogin(user);
    //   if (res.code === 200) {
    //     this.token = res.data;
    //     //本地存储token
    //     SET_TOKEN(res.data);
    //     return res;
    //   } else {
    //     return Promise.reject(new Error(res.message));
    //   }
    // },

    //获取当前用户的数据

    //登录获取用户信息
    async userInfo() {
      let res = await getUserInfo();
      if (res.code === 200) {
        this.menuRoutes = constantRoutes;
        this.user.userId = res.data.user.id;
        this.user.username = res.data.user.username;
        if (res.data.routes !== undefined) {
          this.permissions = res.data.permissions;
          //计算当前用户的异步路由,需要进行深拷贝处理，否则页面刷新后路由会错乱
          let userAsyncRoutes = filterAsyncRoute(
            cloneDeep(asyncRoutes),
            res.data.routes
          );
          //菜单需要的路由数据整理完毕，相当于数组合并，
          //(页面刷新白屏解决)一定要把任意路由加到数组最后。
          this.menuRoutes = [...constantRoutes, ...userAsyncRoutes, anyRoutes];
          //动态路由追加
          userAsyncRoutes.forEach((route) => {
            router.addRoute(route);
          });
          //(匹配不到404页面问题)任意路由要在动态追加完后再追加
          router.addRoute(anyRoutes);
        }
        return "ok";
      } else {
        return Promise.reject(new Error(res.message));
      }
    },

    //退出登录
    logout() {
      this.token = "";
      this.user = {};
      this.loginStatus = false;
      //删除本地token数据
      REMOVE_TOKEN();
      router.push("/login");
    },
  },
});

export default useUserStore;