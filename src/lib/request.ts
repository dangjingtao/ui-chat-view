import axios from "axios";
import message from "./message";
import RequestCache from "./requestCache";

const requestCache = new RequestCache({ noCacheUrl: ["/login"] });

// 创建 axios 实例
const service = axios.create({
  baseURL: "https://ai-proxy.tomz.io",
  timeout: 30000, // 请求超时时间
  headers: {
    "Content-Type": "json/application",
  },
  validateStatus: function (status) {
    return status < 500;
    // return status < 500; // Reject only if the status code is greater than or equal to 500
  },
  // withCredentials: true,
});

// 请求拦截器
service.interceptors.request.use(
  // @ts-ignore
  async (config) => {
    // 在发送请求之前做些什么
    return requestCache.$requestInterceptor(config);
  },
  (error) => {
    // 处理请求错误
    return Promise.reject(error);
  },
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    if (response.status === 401) {
      if (location.pathname !== "/login") {
        location.href = "/login";
      } else {
        message.error("登录失败");
      }
    }

    return requestCache.$responseInterceptor(response);
  },
  (error) => {
    // 处理响应错误
    return error.cached
      ? requestCache.$getCache(error.key)
      : Promise.reject(error);
  },
);

class Request {
  constructor() {}

  request(config: {
    url: string;
    method: string;
    headers?: any;
    data?: any;
    params?: any;
  }) {
    const headers = { ...config.headers };
    let flag = headers.Authorization === null;
    const apiKey = getAPIHeader();
    headers.Authorization = headers.Authorization || `${apiKey}`;
    if (flag) {
      delete headers.Authorization;
    }

    return service({
      url: config.url,
      method: config.method,
      headers,
      data: config.data,
      params: config.params,
    });
  }

  // 封装请求方法
  get(url: string, params?: any) {
    return this.request({ url, method: "get", params });
  }
  post(url: string, data?: any) {
    return this.request({ url, method: "post", data });
  }
  put(url: string, data?: any) {
    return this.request({ url, method: "put", data });
  }
  delete(url: string, params?: any) {
    return this.request({ url, method: "delete", params });
  }
}

const getAPIHeader = () => {
  const apiKey = localStorage.getItem("apiKey"); // 从环境变量中获取 apiKey
  return apiKey ? `Bearer ${apiKey}` : null;
};

const requestInstance = new Request();

const request = (config: {
  url: string;
  method: string;
  headers?: any;
  data?: any;
  params?: any;
}) => {
  return requestInstance.request(config);
};

export default request;
