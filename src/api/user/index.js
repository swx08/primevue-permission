import request from "@/api/request.js";

//请求前缀
const PREFIX = "/user";

export function doLogin(data) {
  return request({
    //模板字符串拼接参数
    url: `${PREFIX}/login`,
    method: "POST",
    data: data,
  });
}

export function saveUser(data) {
  return request({
    //模板字符串拼接参数
    url: `${PREFIX}/add`,
    method: "POST",
    data: data,
  });
}

export function doLogout() {
  return request({
    //模板字符串拼接参数
    url: `${PREFIX}/logout`,
    method: "POST",
  });
}

export function getUserInfo() {
  return request({
    //模板字符串拼接参数
    url: `${PREFIX}/info`,
    method: "POST"
  });
}

export function findUserList(pageNo, pageSize, param) {
  return request({
    //模板字符串拼接参数
    url: `${PREFIX}/list/${pageNo}/${pageSize}`,
    method: "GET",
    params: param,
  });
}

export function queryRoles(userId) {
  return request({
    //模板字符串拼接参数
    url: `${PREFIX}/roles/${userId}`,
    method: "GET",
  });
}

export function updateUserInfo(data) {
  return request({
    //模板字符串拼接参数
    url: `${PREFIX}/update`,
    method: "PUT",
    data: data,
  });
}

export function updateUserStatus(id) {
  return request({
    //模板字符串拼接参数
    url: `${PREFIX}/update/status/${id}`,
    method: "PUT",
  });
}

export function saveRoles(username, data) {
  return request({
    //模板字符串拼接参数
    url: `${PREFIX}/save/roles/${username}`,
    method: "POST",
    data: data,
  });
}

export function queryEchoUserInfo(id) {
  return request({
    //模板字符串拼接参数
    url: `${PREFIX}/echo/${id}`,
    method: "GET",
  });
}

export function deleteUser(id) {
  return request({
    //模板字符串拼接参数
    url: `${PREFIX}/delete/${id}`,
    method: "DELETE",
  });
}

export function batchDelete(ids) {
  return request({
    //模板字符串拼接参数
    url: `${PREFIX}/batch/delete/${ids}`,
    method: "DELETE"
  });
}

export function resetPwd(data) {
  return request({
    //模板字符串拼接参数
    url: `${PREFIX}/reset/pwd`,
    method: "POST",
    data: data,
  });
}