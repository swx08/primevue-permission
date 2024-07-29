//常量路由
export const constantRoutes = [
  {
    path: "/",
    name: "layout",
    component: () => import("@/components/layout/Index.vue"),
    redirect: "/home",
    meta: {
      title: "",
      hidden: false,
      icon: "",
    },
    children: [
      {
        path: "/home",
        name: "Home",
        component: () => import("@/views/home/Index.vue"),
        meta: {
          title: "首页",
          hidden: false,
          icon: "pi pi-gauge",
        },
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/Index.vue"),
    meta: {
      title: "登录",
      hidden: true,
      icon: "UploadFilled",
    },
  },
  // {
  //   path: "/register",
  //   name: "Register",
  //   component: () => import("@/views/register/Index.vue"),
  //   meta: {
  //     title: "注册",
  //     hidden: true,
  //     icon: "UploadFilled",
  //   },
  // },
  {
    path: "/404",
    name: "404",
    component: () => import("@/views/404/Index.vue"),
    meta: {
      title: "404",
      hidden: true,
      icon: "UploadFilled",
    },
  },
];

//异步路由(动态路由)
export const asyncRoutes = [
  {
    path: "/permission",
    name: "Permission",
    component: () => import("@/components/layout/Index.vue"),
    redirect: "/permission/user",
    meta: {
      title: "权限管理",
      hidden: false,
      icon: "pi pi-lock",
    },
    children: [
      {
        path: "/permission/user",
        name: "User",
        component: () => import("@/views/permission/user/Index.vue"),
        meta: {
          title: "用户管理",
          hidden: false,
          icon: "pi pi-user",
        },
      },
      {
        path: "/permission/role",
        name: "Role",
        component: () => import("@/views/permission/role/Index.vue"),
        meta: {
          title: "角色管理",
          hidden: false,
          icon: "pi pi-box",
        },
      },
      {
        path: "/permission/menu",
        name: "Menu",
        component: () => import("@/views/permission/menu/Index.vue"),
        meta: {
          title: "菜单管理",
          hidden: false,
          icon: "pi pi-box",
        },
      },
    ],
  },
  {
    path: "/system",
    name: "System",
    component: () => import("@/components/layout/Index.vue"),
    redirect: "/system/notice",
    meta: {
      title: "系统管理",
      hidden: false,
      icon: "pi pi-cog",
    },
    children: [
      {
        path: "/system/dict",
        name: "Dict",
        component: () => import("@/views/system/dict/Index.vue"),
        meta: {
          title: "字典管理",
          hidden: false,
          icon: "pi pi-envelope",
        },
      },
      {
        path: "/system/dict_data",
        name: "DictData",
        component: () => import("@/views/system/dict_data/Index.vue"),
        meta: {
          title: "字典数据",
          hidden: true,
          icon: "",
        },
      },
      {
        path: "/system/notice",
        name: "Notice",
        component: () => import("@/views/system/notice/Index.vue"),
        meta: {
          title: "公告管理",
          hidden: false,
          icon: "pi pi-envelope",
        },
      },
      {
        path: "/system/log",
        name: "Log",
        component: () => import("@/views/system/log/Index.vue"),
        meta: {
          title: "日志管理",
          hidden: false,
          icon: "pi pi-box",
        },
      },
    ],
  },
];

//任意路由
export const anyRoutes = {
  path: "/:pathMatch(.*)*",
  redirect: "/404",
  name: "any",
  meta: {
    title: "任意路由",
    hidden: true,
    icon: "",
  },
};
