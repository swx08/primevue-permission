import request from "../request.js";

//请求前缀
const PREFIX = "/role";

export function findRoleList(pageNo,pageSize,param) {
  return request({
    //模板字符串拼接参数
    url: `${PREFIX}/list/${pageNo}/${pageSize}`,
    method: "GET",
    params: param,
  });
}

export function queryRoleList() {
  return request({
    //模板字符串拼接参数
    url: `${PREFIX}/list`,
    method: "GET",
  });
}

export function addRole(data) {
  return request({
    //模板字符串拼接参数
    url: `${PREFIX}/add`,
    method: "POST",
    data: data,
  });
}

export function updateRole(data) {
  return request({
    //模板字符串拼接参数
    url: `${PREFIX}/update`,
    method: "PUT",
    data: data,
  });
}

export function savePermission(roleId, data) {
  return request({
    //模板字符串拼接参数
    url: `${PREFIX}/save/permission/${roleId}`,
    method: "POST",
    data: data,
  });
}

export function updateRoleStatus(id) {
  return request({
    //模板字符串拼接参数
    url: `${PREFIX}/update/status/${id}`,
    method: "PUT",
  });
}

export function echoRole(id) {
  return request({
    //模板字符串拼接参数
    url: `${PREFIX}/echo`,
    method: "GET",
    params: {
      id,
    },
  });
}

export function removeRole(id) {
  return request({
    //模板字符串拼接参数
    url: `${PREFIX}/delete`,
    method: "DELETE",
    params: {
      id,
    },
  });
}

export function batchDelete(ids) {
  return request({
    //模板字符串拼接参数
    url: `${PREFIX}/batch/delete/${ids}`,
    method: "DELETE",
  });
}