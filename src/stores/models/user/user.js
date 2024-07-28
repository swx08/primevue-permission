// 导入定义 store 的函数和 ref 函数
import { defineStore } from "pinia";
import { ref } from "vue";

// 定义名为 useUserStore 的 store
export const useUserStore = defineStore("user", () => {
  // 定义名为 user 的响应式变量，并初始化为 null
  const user = ref(null);

  // 返回 user 变量
  return {
    user,
  };
});