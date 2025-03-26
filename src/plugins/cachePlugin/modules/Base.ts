import _ from "lodash";
import { v4 } from "uuid";
import ClientCache from "@/lib/clientCache";
import CommonError from "@/lib/CommonError";
import schema from "../schema";
import request from "@/lib/request";

export default class CachePlugin {
  protected cache: ClientCache;
  protected lodash: _.LoDashStatic;
  protected uuidV4: () => string;
  protected CommonError: typeof CommonError;
  protected request: typeof request;

  constructor() {
    this.cache = new ClientCache();
    this.lodash = _;
    this.uuidV4 = v4;
    this.CommonError = CommonError;
    this.request = request;
  }

  async install(): Promise<void> {
    const { cache } = this;
    const isInit = await cache.checkDatabaseExists("isInit");
    if (!isInit) {
      await cache.initDatabase(schema);
      await cache.set("llm_provider_name", "groq");
      await cache.set("task_llm_provider_name", "groq");
      await cache.set("task_embed_provider_name", "cloudflare");
    }
  }

  generateNewDataMeta(data) {
    console.log(this);
    data = this.lodash.cloneDeep(data);
    const meta = {
      createTime: Date.now(),
      updateTime: Date.now(),
      id: this.uuidV4(),
    };
    return this.lodash.merge(meta, data);
  }

  //! 危险操作
  async clearAllCache() {
    const { cache } = this;
    await cache.clear();
  }
}
