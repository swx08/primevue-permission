// 导入 defineStore 和 ref 方法
import { defineStore } from "pinia";
import { ref } from "vue";

// 定义名为 useTokenStore 的 store
export const useThemeStore = defineStore("theme", () => {
  // 创建一个名为 token 的响应式变量
  const dark = ref(false);
  const theme = ref(0);
  const isSimple = ref(false);

  const setTheme = (item) => {
    if (item === "aura") {
      theme.value = 0;
    } else if (item === "lara") {
      theme.value = 1;
    } else if (item === "nora") {
      theme.value = 2;
    }
  };

  // 返回 token 变量
  return {
    dark,
    theme,
    setTheme,
    isSimple
  };
});