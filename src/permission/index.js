import pinia from "@/stores";
import useUserStore from "@/stores/models/user/user";

const uesrStore = useUserStore(pinia);
export const hasPermission = (app) => {
  
    //全局自定义指令，实现按钮权限判断
    app.directive('permission', {
        //代办使用这个全局自定义指令的Dom/组件挂载完毕时会执行一次
        mounted(el, options) {
            //el为元素，options是指令的选项对象
            if (!uesrStore.permissions.includes(options.value)) {
              //说明没有权限，直接删除元素即可
            //   el.remove();
              el.setAttribute("disabled", "disabled");
            }
        },
    })
};