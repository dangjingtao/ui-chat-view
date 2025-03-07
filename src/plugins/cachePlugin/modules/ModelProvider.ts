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

  async setCurrentProvider(providerName: string) {
    const { cache } = this;
    await cache.set("current_provider_name", providerName);
  }

  // 设置向量模型供应商
  async setCurrentEmbedProvider(providerName: string) {
    const { cache } = this;

    await cache.set("current_embed_provider", providerName);
  }

  // 获取向量模型提供商
  async getCurrentEmbedProvider(providerName: string) {
    const { cache } = this;
    await cache.set("current_embed_provider", providerName);
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

  // 设置向量模型
  async setCurrentEmbedModel(modelName: string) {
    await this.cache.set("current_embed_model", modelName);
  }

  // 获取向量模型（注意，向量模型是系统工作级别的）
  async getCurrentEmbedModel() {
    return await this.cache.get("current_embed_model");
  }
}
