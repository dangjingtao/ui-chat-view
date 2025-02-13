import axios from "axios";

// 创建 axios 实例
const service = axios.create({
  baseURL: "http://localhost:5090", // 基础URL
  timeout: 30000, // 请求超时时间
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    // 比如添加 token
    // config.headers['Authorization'] = 'Bearer token';
    return config;
  },
  (error) => {
    // 处理请求错误
    return Promise.reject(error);
  },
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    return response.data;
  },
  (error) => {
    // 处理响应错误
    return Promise.reject(error);
  },
);

class Request {
  request(config: {
    url: string;
    method: string;
    headers?: any;
    data?: any;
    params?: any;
  }) {
    return service.request({
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data,
      params: config.params,
    });
  }

  // 封装请求方法
  get(url: string, params?: any) {
    return service.get(url, { params });
  }
  post(url: string, data?: any) {
    return service.post(url, data);
  }
  put(url: string, data?: any) {
    return service.put(url, data);
  }
  delete(url: string, params?: any) {
    return service.delete(url, { params });
  }
}

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

// 将其他方法绑定到request函数上
["get", "post", "put", "delete"].forEach((method) => {
  request[method] = requestInstance[method].bind(requestInstance);
});

export default request;
