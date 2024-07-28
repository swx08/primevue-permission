// 导入 defineStore 和 ref 方法
import { defineStore } from "pinia";
import { ref } from "vue";

// 定义名为 useTokenStore 的 store
export const useTokenStore = defineStore("token", () => {
  // 创建一个名为 token 的响应式变量
  const token = ref("");

  // 返回 token 变量
  return {
    token,
  };
});