import Base from "./Base";

export default class extends Base {
  [x: string]: any;

  // 获取AI供应商
  async getProviders() {
    const { cache } = this;
    const modelsMap = await cache.get("providersMap");
    return Object.entries(modelsMap).map(([_key, value]) => value);
  }

  async getProviderConfigByName(provider_name) {
    const providerConfigs = await this.getProviders();

    const providerConfig = providerConfigs.find(
      (item) => item.provider === provider_name,
    );

    return providerConfig;
  }

  // 网络请求，根据服务商找模型 ，此方法需要重构。需要确定检索依据是llm 还是embedding,是task还是对话,因此这是一个桥接方法！
  async getModelsByProvider({
    type,
  }: {
    type: "task_llm" | "task_embed" | "llm";
  }) {
    const { cache, request, CommonError } = this;
    const provider_name = await cache.get(`${type}_provider_name`);
    if (!provider_name) {
      console.warn("provider_name not set in cache");
      throw new CommonError("provider_name not set in cache");
    }

    const providerConfig = await this.getProviderConfigByName(provider_name);
    const { customerBaseURL, baseURL } = providerConfig;

    const domain = customerBaseURL || baseURL;

    let models_url = `${domain}/v1/models`;
    if (provider_name === "groq") {
      models_url = `${domain}/openai/v1/models`;
    }

    if (provider_name === "gemini") {
      models_url = `${domain}/v1beta/openai/models`;
    }

    const { data } = await request({
      url: models_url,
      method: "GET",
    });

    const { models } = data;
    let result = data.data;
    if (provider_name === "cohere" && !!models) {
      result = models;
    }
    return result.map((item) => ({
      ...item,
      id: item.id || item.name,
      name: item.name || item.id,
    }));
  }

  /************** LLM 对话 服务商 ************* */

  async getConversationLLMProvider() {
    const { cache } = this;
    return await cache.get("llm_provider_name");
  }

  async setConversationLLMProvider(providerName: string) {
    const { cache } = this;
    await cache.set("llm_provider_name", providerName);
  }

  /************** LLM 任务模型 ************* */
  // [封装]获取任务LLM模型提供商列表
  async getTaskLLMModels() {
    return await this.getModelsByProvider({ type: "task_llm" });
  }

  // 设置LLM任务模型供应商
  async setTaskLLMProvider(providerName: string) {
    const { cache } = this;
    await cache.set("task_llm_provider_name", providerName);
  }

  // 获取LLM任务服务商
  async getTaskLLMProvider() {
    const { cache } = this;
    return await cache.get("task_llm_provider_name");
  }

  // 获取LLM任务服模型（选中）
  async getTaskLLMModel() {
    const { cache } = this;
    return await cache.get("task_llm_model_name");
  }

  // 设置LLM任务模型
  async setTaskLLMModel(modelName: string) {
    const { cache } = this;
    return await cache.set("task_llm_model_name", modelName);
  }

  /************** Embed 任务模型 **************/

  // 【封装]获取任务向量模型提供商列表
  async getTaskEmbedModels() {
    return await this.getModelsByProvider({ type: "task_embed" });
  }

  // 获取任务向量模型供应商
  async getTaskEmbedProvider() {
    const { cache } = this;
    return await cache.get("task_embed_provider_name");
  }

  // 设置任务向量模型供应商
  async setTaskEmbedProvider(providerName: string) {
    const { cache } = this;
    await cache.set("task_embed_provider_name", providerName);
  }

  // 获取任务向量模型
  async getTaskEmbedModel() {
    return await this.cache.get("task_embed_model_name");
  }

  // 设置任务向量模型
  async setTaskEmbedModel(modelName: string) {
    await this.cache.set("task_embed_model_name", modelName);
  }

  // 设置自定义服务商
  async setConversationLLMProviderDomain({
    provider,
    baseURL,
    apiKey,
  }: {
    provider: string;
    baseURL: string;
    apiKey: string;
  }) {
    const { cache } = this;
    const customerProviderSetting = (await cache.get("providersMap")) || {};
    if (!customerProviderSetting[provider]) {
      customerProviderSetting[provider] = {
        provider,
        baseURL,
        apiKey,
      };
    } else {
      customerProviderSetting[provider] = {
        ...customerProviderSetting[provider],
        customerBaseURL: baseURL,
        apiKey,
      };
    }

    await cache.set("providersMap", customerProviderSetting);
  }

  async getConversationLLMProviderSetting(provider) {
    const { cache } = this;
    return (await cache.get("providersMap"))[provider];
  }
}
