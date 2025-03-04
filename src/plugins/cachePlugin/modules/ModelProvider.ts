import Base from "./Base";

// 只存基础数据
export default class extends Base {
  async getModels() {
    const { cache } = this;
    const modelsMap = await cache.get("models");
    return Object.entries(modelsMap).map(([_key, value]) => value);
  }

  async getCurrentProvider() {
    const { cache } = this;
    const current_provider_name = await cache.get("current_provider_name");
    return current_provider_name;
  }

  async setCurrentProvider(modelName: string) {
    const { cache } = this;
    await cache.set("current_model_name", modelName);
  }

  async setCurrentModel(modelName: string) {
    const { cache } = this;

    await cache.set("current_model_name", modelName);
  }

  async getCurrentModel() {
    const { cache } = this;

    const currentModelName = await cache.get("current_model_name");
    return currentModelName;
  }
}
