// 路由配置
const routes = [
  {
    path: "/",
    component: () => import("@/components/layout/Index.vue"),
    redirect: "/home",
    children: [
      {
        path: "/home",
        name: "Home",
        component: () => import("@/views/home/Index.vue"),
        meta: {
          title: "首页",
          hidden: false,
          icon: "Avatar",
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
      icon: "LockOutlined",
    },
    children: [
      {
        path: "/system/notice",
        name: "Notice",
        component: () => import("@/views/system/notice/Index.vue"),
        meta: {
          title: "公告管理",
          hidden: false,
          icon: "UserOutlined",
        },
      },
      {
        path: "/system/dict",
        name: "Dict",
        component: () => import("@/views/system/dict/Index.vue"),
        meta: {
          title: "字典管理",
          hidden: false,
          icon: "UserSwitchOutlined",
        },
      },
    ],
  },
  {
    path: "/permission",
    name: "Permission",
    component: () => import("@/components/layout/Index.vue"),
    redirect: "/permission/user",
    meta: {
      title: "权限管理",
      hidden: false,
      icon: "LockOutlined",
    },
    children: [
      {
        path: "/permission/user",
        name: "User",
        component: () => import("@/views/permission/user/Index.vue"),
        meta: {
          title: "用户管理",
          hidden: false,
          icon: "UserOutlined",
        },
      },
      {
        path: "/permission/role",
        name: "Role",
        component: () => import("@/views/permission/role/Index.vue"),
        meta: {
          title: "角色管理",
          hidden: false,
          icon: "UserSwitchOutlined",
        },
      },
      {
        path: "/permission/menu",
        name: "Menu",
        component: () => import("@/views/permission/menu/Index.vue"),
        meta: {
          title: "菜单管理",
          hidden: false,
          icon: "AppstoreOutlined",
        },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/404/Index.vue"),
    meta: {
      title: "404",
      hidden: true,
      icon: "",
    },
  },
];

export default routes;
