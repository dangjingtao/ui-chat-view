import md5 from "md5";
import { AxiosRequestConfig, AxiosResponse } from "axios";

// 缓存条目接口定义
interface CacheEntry {
  status: number;
  data: any;
  timestamp: number;
  expiry: number;
}

class RequestCache {
  private cache: Map<string, CacheEntry>;
  private noCacheUrl: string[];
  private defaultExpiry: number;
  private cleanupInterval: number;

  /**
   * 构造函数
   * @param noCacheUrl 不需要缓存的 URL 列表
   * @param defaultExpiry 默认缓存过期时间，单位为毫秒
   * @param cleanupInterval 清理间隔时间，单位为毫秒
   */
  constructor({
    noCacheUrl = [],
    defaultExpiry = 60000,
    cleanupInterval = 60000,
  }: {
    noCacheUrl: string[];
    defaultExpiry?: number;
    cleanupInterval?: number;
  }) {
    this.cache = new Map();
    this.noCacheUrl = noCacheUrl;
    this.defaultExpiry = defaultExpiry; // 默认缓存过期时间，单位为毫秒
    this.cleanupInterval = cleanupInterval; // 清理间隔时间，单位为毫秒

    // 启动定期清理任务
    setInterval(() => this.cleanup(), this.cleanupInterval);
  }

  /**
   * 生成缓存键
   * @param config 请求配置
   * @returns 生成的缓存键
   */
  private genKey(config: AxiosRequestConfig): string {
    const { method, url, params = {}, data = {} } = config;
    const sortedParams = Object.keys({ ...params, ...data })
      .sort()
      .reduce((obj, key) => {
        obj[key] = params[key] || data[key];
        return obj;
      }, {});
    return md5(`${method}_${url}_${JSON.stringify(sortedParams)}`);
  }

  /**
   * 检查缓存条目是否有效
   * @param cacheEntry 缓存条目
   * @returns 缓存条目是否有效
   */
  private isCacheValid(cacheEntry: CacheEntry): boolean {
    const { timestamp, expiry } = cacheEntry;
    return Date.now() - timestamp < expiry;
  }

  /**
   * 清理过期缓存条目
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, cacheEntry] of this.cache.entries()) {
      if (now - cacheEntry.timestamp >= cacheEntry.expiry) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * 获取缓存条目
   * @param config 请求配置
   * @returns 缓存条目或 undefined
   */
  public getCache(config: AxiosRequestConfig): CacheEntry | undefined {
    const key = this.genKey(config);
    const cacheEntry = this.cache.get(key);
    if (cacheEntry && this.isCacheValid(cacheEntry)) {
      return cacheEntry;
    } else {
      this.cache.delete(key);
      return undefined;
    }
  }

  /**
   * 检查是否存在有效缓存条目
   * @param config 请求配置
   * @returns 是否存在有效缓存条目
   */
  public hasCache(config: AxiosRequestConfig): boolean {
    const key = this.genKey(config);
    const cacheEntry = this.cache.get(key);
    if (cacheEntry && this.isCacheValid(cacheEntry)) {
      return true;
    } else {
      this.cache.delete(key);
      return false;
    }
  }

  /**
   * 设置缓存条目
   * @param config 请求配置
   * @param response 响应数据
   * @param expiry 缓存过期时间，单位为毫秒
   */
  public setCache(
    config: AxiosRequestConfig,
    response: AxiosResponse,
    expiry?: number,
  ): void {
    const key = this.genKey(config);
    this.cache.set(key, {
      status: response.status,
      data: response.data,
      timestamp: Date.now(),
      expiry: expiry || this.defaultExpiry,
    });
  }

  /**
   * 请求拦截器
   * @param config 请求配置
   * @returns Promise
   */
  public $requestInterceptor(
    config: AxiosRequestConfig,
  ): Promise<AxiosRequestConfig> {
    const { noCache } = config;
    this.noCache = noCache;
    if (noCache) {
      return Promise.resolve(config);
    }
    if (this.hasCache(config)) {
      return Promise.reject({
        cached: true,
        key: this.genKey(config),
      });
    } else {
      return Promise.resolve(config);
    }
  }

  /**
   * 响应拦截器
   * @param response 响应数据
   * @returns 响应数据
   */
  public $responseInterceptor(response: AxiosResponse): AxiosResponse {
    const needCache =
      !this.noCacheUrl.includes(response.config.url!) && !this.noCache;
    if (needCache) {
      this.setCache(response.config, response);
    }
    return response;
  }

  /**
   * 获取缓存条目
   * @param key 缓存键
   * @returns 缓存条目或 undefined
   */
  public $getCache(key: string): CacheEntry | undefined {
    return this.cache.get(key);
  }
}

export default RequestCache;
