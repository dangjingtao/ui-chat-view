import { type App, inject } from "vue";
import ClientCache from "@/lib/clientCache";
import schema from "./config";
const CACHE_KEY = Symbol("cache");

export default {
  async install(app: App): Promise<void> {
    const cache = new ClientCache("localForage");
    app.provide(CACHE_KEY, cache);
    const hc_result = await cache.checkDatabaseExists("isInited");
    if (!hc_result) {
      await cache.set("current_provider_name", "groq");
      await cache.set("current_model_name", "");
      await cache.initDatabase(schema);
    }
  },
};

// 加入缓存机制，避免重复请求

export function useCache() {
  const cache = inject(CACHE_KEY) as ClientCache;
  if (!cache) {
    throw new Error("Cache not provided");
  }

  return {
    getModels: async () => {
      const modelsMap = await cache.get("models");
      return Object.entries(modelsMap).map(([_key, value]) => value);
    },

    // getCurrentProviderContext: async () => {
    //   const current_provider_name = await cache.get("current_provider_name");
    //   const modelsMap = await cache.get("models");
    //   console.log("modelsMap", modelsMap);
    //   console.log("currentModelName", currentModelName);
    //   return modelsMap[currentModelName];
    // },
    getCurrentProvider: async () => {
      const current_provider_name = await cache.get("current_provider_name");
      return current_provider_name;
    },
    setCurrentProvider: async (modelName: string) => {
      await cache.set("current_model_name", modelName);
    },
    setCurrentModel: async (modelName: string) => {
      await cache.set("current_model_name", modelName);
    },
    getCurrentModel: async () => {
      const currentModelName = await cache.get("current_model_name");
      return currentModelName;
    },

    getCurrentModelContext: async () => {
      const current_provider_name = await cache.get("current_provider_name");
      const modelsMap = await cache.get("models");
      const current_model_name = await cache.get("current_model_name");
      return {
        current_model_name,
        ...modelsMap[current_provider_name],
      };
    },
  };
}
