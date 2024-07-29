import request from "../request.js";

//请求前缀
const PREFIX = "/dict/data";

export function findDictList(pageNo,pageSize,param) {
  return request({
    //模板字符串拼接参数
    url: `${PREFIX}/list/${pageNo}/${pageSize}`,
    method: "GET",
    params: param,
  });
}

export function addDictData(data) {
  return request({
    //模板字符串拼接参数
    url: `${PREFIX}/add`,
    method: "POST",
    data: data,
  });
}

export function updateDict(data) {
  return request({
    //模板字符串拼接参数
    url: `${PREFIX}/update`,
    method: "PUT",
    data: data,
  });
}

export function updateDictStatus(id) {
  return request({
    //模板字符串拼接参数
    url: `${PREFIX}/update/status/${id}`,
    method: "PUT",
  });
}

export function echoDict(id) {
  return request({
    //模板字符串拼接参数
    url: `${PREFIX}/echo/${id}`,
    method: "GET"
  });
}

export function queryDictLabel(type) {
  return request({
    //模板字符串拼接参数
    url: `${PREFIX}/query/label`,
    method: "GET",
    params: {
      type: type,
    },
  });
}

export function removeDict(id) {
  return request({
    //模板字符串拼接参数
    url: `${PREFIX}/delete/${id}`,
    method: "DELETE"
  });
}

export function batchDelete(ids) {
  return request({
    //模板字符串拼接参数
    url: `${PREFIX}/batch/delete/${ids}`,
    method: "DELETE",
  });
}