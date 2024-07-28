import { defineStore } from "pinia";
import { ref } from "vue";

export const useCollapsedStore = defineStore("collapsed", () => {
  //侧边栏收缩状态控制，默认不收缩
  const collapsed = ref(false);

  return {
    collapsed,
  };
});
