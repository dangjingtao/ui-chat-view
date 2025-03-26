import Base from "./Base";

type ProviderType = "task_llm" | "task_embed" | "llm";

interface ProviderConfig {
  customerBaseURL?: string;
  baseURL: string;
}

interface Model {
  id: string;
  name: string;
  [key: string]: any;
}

export default class extends Base {
  [x: string]: any;

  // 获取AI供应商
  async getProviders() {
    const { cache } = this;
    const modelsMap = await cache.get("providersMap");
    return Object.entries(modelsMap).map(([_key, value]) => value);
  }

  async getProviderConfigByName(provider_name: string) {
    const providerConfigs = await this.getProviders();

    const providerConfig = providerConfigs.find(
      (item) => item.provider === provider_name,
    );

    return providerConfig;
  }

  // 网络请求，根据服务商找模型
  async getModelsByProvider({
    type,
  }: {
    type: ProviderType;
  }): Promise<Model[]> {
    const provider_name = await this.getProviderNameFromCache(type);
    const providerConfig = await this.getProviderConfigByName(provider_name);
    const modelsUrl = this.getModelsUrl(provider_name, providerConfig, type);

    const data = await this.fetchModels(modelsUrl);
    return this.formatModels(data, provider_name);
  }

  // 从缓存中获取 provider_name
  private async getProviderNameFromCache(type: ProviderType): Promise<string> {
    const { cache, CommonError } = this;
    const provider_name = await cache.get(`${type}_provider_name`);
    if (!provider_name) {
      console.warn("provider_name not set in cache");
      throw new CommonError("provider_name not set in cache");
    }
    return provider_name;
  }

  // 根据服务商名称和配置生成模型 URL
  private getModelsUrl(
    provider_name: string,
    config: ProviderConfig,
    type,
  ): string {
    const { customerBaseURL, baseURL } = config;
    const domain = customerBaseURL || baseURL;

    const providerUrls: Record<string, string> = {
      groq: `${domain}/openai/v1/models`,
      cloudflare: `${domain}/models/search?per_page=100&task=${type === "task_embed" ? "Text+Embeddings" : "Text+Generation"}`,
      gemini: `${domain}/v1beta/openai/models`,
    };

    return providerUrls[provider_name] || `${domain}/v1/models`;
  }

  // 发起网络请求获取模型数据
  private async fetchModels(url: string): Promise<any> {
    const { request, CommonError } = this;
    try {
      const { data } = await request({
        url,
        method: "GET",
      });
      return data;
    } catch (error) {
      console.error("Failed to fetch models:", error);
      throw new CommonError("Failed to fetch models");
    }
  }

  // 格式化模型数据
  private formatModels(data: any, provider_name: string): Model[] {
    let result = data.data || data.models || [];
    if (provider_name === "cloudflare") {
      result = data.result || [];
    }

    return result.map((item: any) => ({
      ...item,
      _id: item.id,
      id: item.name || item.id,
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
  async getTaskLLMModels() {
    return await this.getModelsByProvider({ type: "task_llm" });
  }

  async setTaskLLMProvider(providerName: string) {
    const { cache } = this;
    await cache.set("task_llm_provider_name", providerName);
  }

  async getTaskLLMProvider() {
    const { cache } = this;
    return await cache.get("task_llm_provider_name");
  }

  async getTaskLLMModel() {
    const { cache } = this;
    return await cache.get("task_llm_model_name");
  }

  async setTaskLLMModel(modelName: string) {
    const { cache } = this;
    return await cache.set("task_llm_model_name", modelName);
  }

  /************** Embed 任务模型 **************/

  async getTaskEmbedModels() {
    return await this.getModelsByProvider({ type: "task_embed" });
  }

  async getTaskEmbedProvider() {
    const { cache } = this;
    return await cache.get("task_embed_provider_name");
  }

  async setTaskEmbedProvider(providerName: string) {
    const { cache } = this;
    await cache.set("task_embed_provider_name", providerName);
  }

  async getTaskEmbedModel() {
    return await this.cache.get("task_embed_model_name");
  }

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

  async getConversationLLMProviderSetting(provider: string) {
    const { cache } = this;
    return (await cache.get("providersMap"))[provider];
  }
}
