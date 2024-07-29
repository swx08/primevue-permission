# Vue 3 + Vite + Primevue

## 介绍
> 权限版，包含登录、动态路由、权限管理、系统管理、富文本编辑器

## 1. 安装依赖
```bash
npm install
```

## 2. 运行项目
```bash
npm run dev
```

## 3. 打包项目
```bash
npm run build
```

## 主面板展示
>简约模式
![](https://pic.imgdb.cn/item/66a4c9e9d9c307b7e99a82be.png)

>暗黑模式

![](https://pic.imgdb.cn/item/66a4ca09d9c307b7e99aa0c8.png)


## 集成vue-sidebar-menu菜单栏组件

>github地址：<https://github.com/yaminncco/vue-sidebar-menu>

>官网地址：<https://yaminncco.github.io/vue-sidebar-menu/#/>

```bash
# 安装依赖
npm i vue-sidebar-menu --save
```

具体使用方法参考官网


## 封装Toast提示组件

### 1、src下新建app.js文件
```javascript
//将原来main.js中的代码复制到app.js中 ...

//由于需要全局使用Toast，从main.js中迁移过来
import { createApp } from "vue";
//引入全局样式文件
import "./style/index.scss";
import App from "./App.vue";

//primevue组件库
import PrimeVue from "primevue/config";
import "primeicons/primeicons.css";
import Aura from "@primevue/themes/aura";
import Lara from "@primevue/themes/lara";
import Nora from "@primevue/themes/nora";
import ToastService from "primevue/toastservice";
import Tooltip from "primevue/tooltip";

//Pinia
import pinia from "@/stores/index";
//引入pina持久化插件
import { createPersistedState } from "pinia-persistedstate-plugin";

//路由
import router from "@/router";
//路由鉴权
import "./permission";

//自定义插件用来注册全局组件
import "virtual:svg-icons-register";
import globalComponent from "@/plugins";

import { useThemeStore } from "@/stores/models/theme";

const app = createApp(App);
const persist = createPersistedState();
app.use(pinia);
pinia.use(persist);

//安装自定义插件
app.use(globalComponent);
//将各种实例挂载到全局
const themeStore = useThemeStore();
app.use(PrimeVue, {
  theme: {
    preset:
      themeStore.theme === 0 ? Aura : themeStore.theme === 1 ? Lara : Nora,
    options: {
      darkModeSelector: ".my-app-dark",
      cssLayer: {
        name: "primevue",
        order: "tailwind-base, primevue, tailwind-utilities",
      },
    },
  },
});

app.directive("tooltip", Tooltip);
app.use(ToastService);

app.use(router);

export default app;
```

### 2、修改main.js文件
```javascript
import app from "@/app";
app.mount("#app");
```

### 3、在utils下新建toast.js文件
```javascript
//封装Primevue的Toast，否则在request.js中无法全局使用
import app from '@/app'
const getToast = () => app.config.globalProperties.$toast
const toast = {
 add(param) {
  getToast().add(param)
 }
}
export default toast
```

### 4、在request.js中引入toast使用
```javascript
//对于axios进行二次封装
import axios from "axios";
import toast from "@/utils/toast";
import router from "@/router/index";
import useUserStore from "@/stores/models/user/user.js";


//配置通用的基础路径和超时时间
const requests = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 60000,
});

//请求拦截器
requests.interceptors.request.use((config) => {
  //config：配置对象，对象里面有一个属性很重要，headers请求头
  let userStore = useUserStore();
  if (userStore.token) {
    config.headers["authorization"] = userStore.token; // 设置请求头
  }
  return config;
});

//响应拦截器
requests.interceptors.response.use(
  (response) => {
    //响应成功的回调
    const res = response.data;
    const code = res.code;
    if (code !== 200) {
      toast.add({
        severity: "error",
        summary: res.message,
        life: 3000,
      });
    }
    if (code === 403) {
      // authorizationStore.removeAuthorization();
      router.push("/login");
    }
    if (code === 1002) {
      // authorizationStore.removeAuthorization();
      router.push("/login");
    }
    return res;
  },
  (error) => {
    //响应失败的回调
    return Promise.reject(new Error("faile"));
  }
);

//对外暴露
export default requests;

```
