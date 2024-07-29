// 导入 defineStore 和 ref 方法
import { defineStore } from "pinia";
import { ref } from "vue";

// 定义名为 useTokenStore 的 store
export const useThemeStore = defineStore("theme", () => {
  // 创建一个名为 token 的响应式变量
  const dark = ref(false);
  const theme = ref(0);
  const isSimple = ref(false);
  const currentMenuBgColor = ref("#FFFFFF");
  const simpleMenuColor = ref([
    "#FFFFFF",
    "#dedeff",
    "#cee8ff",
    "#F5ECD7",
    "#D0EBEA",
    "#e0e0e0",
    "#61bc84",
    "#acc2ef",
  ]);
  const businessMenuColor = ref([
    "#0085ff",
    "#18181b",
    "#00668c",
    "#313d44",
    "#3b3c3d",
    "#1F3A5F",
    "#24613b",
    "#5e3b00",
    "#022c22",
    "#450a0a",
    "#042f2e",
    "#082f49",
    "#172554",
    "#1e1b4b",
  ]);

  const setTheme = (item) => {
    if (item === "aura") {
      theme.value = 0;
    } else if (item === "lara") {
      theme.value = 1;
    } else if (item === "nora") {
      theme.value = 2;
    }
    //刷新
    location.reload();
  };

  // 返回 token 变量
  return {
    dark,
    theme,
    setTheme,
    isSimple,
    currentMenuBgColor,
    simpleMenuColor,
    businessMenuColor,
  };
});
