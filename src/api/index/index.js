import request from "../request.js";

//请求前缀
const api_prefix = "/index";

//以下列举几种常用的请求方式

//第一种：无参请求
export function findRegisterUserNum() {
  return request({
    //模板字符串拼接参数
    url: `${api_prefix}/test`,
    method: "GET",
  });
}

//第二种：有参请求
export function findPineLineToal(userId) {
  return request({
    //模板字符串拼接参数
    url: `${api_prefix}/PineLine/total/${userId}`,
    method: "GET",
  });
}

//第三种：携带json参数请求
export function login(data) {
  return request({
    //模板字符串拼接参数
    url: `${api_prefix}/login`,
    method: "POST",
    data: data,
  });
}

//第四种：param单个参数请求
export function getList(username) {
  return request({
    //模板字符串拼接参数
    url: `${api_prefix}/list`,
    method: "GET",
    params: username,
  });
}

//第五种：param多个参数请求
export function list(username, password) {
  return request({
    //模板字符串拼接参数
    url: `${api_prefix}/list`,
    method: "GET",
    params: {
      username: username,
      password: password,
    },
  });
}
