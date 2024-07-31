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
import ConfirmationService from "primevue/confirmationservice";

//弹窗提示插件
import Vue3Toasity from "vue3-toastify";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

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

//引入自定义指令文件
import { hasPermission } from "@/permission/index";

import { useThemeStore } from "@/stores/models/theme";

//表单验证
import { vue_best_verify } from "vue-best-verify";
import "vue-best-verify/dist/style.css";

const app = createApp(App);
const persist = createPersistedState();
pinia.use(persist);
app.use(pinia);

//弹窗提示插件配置
app.use(Vue3Toasity, {
  autoClose: 3000,
  transition: toast.TRANSITIONS.FLIP,
  position: toast.POSITION.TOP_CENTER,
});

//安装自定义插件
app.use(globalComponent);

//注册自定义指令
hasPermission(app);

//将各种实例挂载到全局
const themeStore = useThemeStore();
console.log(themeStore);
app.use(PrimeVue, {
  theme: {
    preset: themeStore.theme === 0 ? Aura : themeStore.theme === 1 ? Lara : Nora,
    options: {
      darkModeSelector: ".my-app-dark"
    },
  },
});

app.directive("tooltip", Tooltip);
app.use(ToastService);
app.use(ConfirmationService);

app.use(vue_best_verify);

app.use(router);

app.mount("#app");
