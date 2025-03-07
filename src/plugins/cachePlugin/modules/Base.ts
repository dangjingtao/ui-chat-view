import _, { update } from "lodash";
import { v4 } from "uuid";
import ClientCache from "@/lib/clientCache";
import CommonError from "@/lib/CommonError";
import schema from "../schema";

export default class CachePlugin {
  protected cache: ClientCache;
  protected lodash: _.LoDashStatic;
  protected uuidV4: () => string;
  protected CommonError: typeof CommonError;

  constructor() {
    this.cache = new ClientCache();
    this.lodash = _;
    this.uuidV4 = v4;
    this.CommonError = CommonError;
  }

  async install(): Promise<void> {
    const { cache } = this;
    const hc_result = await cache.checkDatabaseExists("isInited");
    if (!hc_result) {
      await cache.initDatabase(schema);
      await cache.set("current_provider_name", "groq");
      await cache.set("current_model_name", "");
      await cache.set("conversation", "");
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
