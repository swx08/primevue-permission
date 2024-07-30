import request from "../request.js";

//请求前缀
const PREFIX = "/menu";

export function queryMenuList() {
  return request({
    //模板字符串拼接参数
    url: `${PREFIX}/primeVue/list`,
    method: "GET",
  });
}

export function queryMenuListByLike(data) {
  return request({
    //模板字符串拼接参数
    url: `${PREFIX}/list/like`,
    method: "POST",
    data: data,
  });
}

export function addMenu(data) {
  return request({
    //模板字符串拼接参数
    url: `${PREFIX}/add`,
    method: "POST",
    data: data,
  });
}

export function queryRoleMenuList(id) {
  return request({
    //模板字符串拼接参数
    url: `${PREFIX}/query/role/permissions`,
    method: "GET",
    params: {
      id,
    },
  });
}

export function updateMenu(data) {
  return request({
    //模板字符串拼接参数
    url: `${PREFIX}/update`,
    method: "PUT",
    data: data,
  });
}

export function echoMenu(id) {
  return request({
    //模板字符串拼接参数
    url: `${PREFIX}/echo`,
    method: "GET",
    params: {
      id,
    },
  });
}

export function removeMenu(id) {
  return request({
    //模板字符串拼接参数
    url: `${PREFIX}/delete`,
    method: "DELETE",
    params: {
      id,
    },
  });
}