//校验权限标识
export function verifyMenuName(menu) {
  if (menu.permission !== undefined && menu.permission !== null && menu.permission !== "") {
    const permissionRegex = /^([^:]+:)+([^:]+)$/;
    if (!permissionRegex.test(menu.permission)) {
      throw Error("权限标识不符合规范，请修改！");
    }
  }
  
  if (menu.component !== undefined && menu.component !== null && menu.component !== "") {
    const componentRegex = /^(\/[^\/]+)+$/;
    if (!componentRegex.test(menu.component)) {
      throw Error("组件路径不符合规范，请修改！");
    }
  }
}