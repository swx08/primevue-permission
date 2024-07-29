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