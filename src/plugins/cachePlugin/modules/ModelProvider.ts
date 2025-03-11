import Base from "./Base";

// 只存基础数据
export default class extends Base {
  async getProviders() {
    const { cache } = this;
    const modelsMap = await cache.get("providersMap");
    return Object.entries(modelsMap).map(([_key, value]) => value);
  }

  async getCurrentProvider() {
    const { cache } = this;
    const llm_provider_name = await cache.get("llm_provider_name");
    return llm_provider_name;
  }

  async setCurrentProvider(providerName: string) {
    const { cache } = this;
    await cache.set("llm_provider_name", providerName);
  }

  // 设置向量模型供应商
  async setCurrentEmbedProvider(providerName: string) {
    const { cache } = this;

    await cache.set("embed_provider_name", providerName);
  }

  // 获取向量模型提供商
  async getCurrentEmbedProvider(providerName: string) {
    const { cache } = this;
    await cache.set("embed_provider_name", providerName);
  }

  // 设置向量模型
  async setCurrentEmbedModel(modelName: string) {
    await this.cache.set("embed_model", modelName);
  }

  // 获取向量模型（注意，向量模型是系统工作级别的）
  async getCurrentEmbedModel() {
    return await this.cache.get("embed_model");
  }
}
