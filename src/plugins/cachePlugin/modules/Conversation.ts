import Base from "./Base";

// 只存基础数据
export default class extends Base {
  [x: string]: any;
  async getProviderConfigByName(provider_name) {
    const providerConfigs = await this.getProviders();

    const providerConfig = providerConfigs.find(
      (item) => item.provider === provider_name,
    );

    return providerConfig;
  }

  // 网络请求，根据服务商找模型
  private async getModelsByProvider() {
    const { cache, request } = this;
    const llm_provider_name = await cache.get("llm_provider_name");

    const providerConfig =
      await this.getProviderConfigByName(llm_provider_name);
    const { baseURL } = providerConfig;

    let models_url = `${baseURL}/v1/models`;
    if (llm_provider_name === "groq") {
      models_url = `${baseURL}/openai/v1/models`;
    }

    if (llm_provider_name === "gemini") {
      models_url = `${baseURL}/v1beta/openai/models`;
    }

    try {
    } catch (error) {}
    const { data } = await request({
      url: models_url,
      method: "GET",
    });

    const { models } = data;
    let result = data.data;
    if (llm_provider_name === "cohere" && !!models) {
      result = models;
    }
    return result.map((item) => ({
      ...item,
      id: item.id || item.name,
      name: item.name || item.id,
    }));
  }

  // 初始化获取上下文
  async getChatContext() {
    const { cache } = this;

    const llm_provider_name = await cache.get("llm_provider_name");
    // ! 此处读写会很高频
    const providerConfig =
      await this.getProviderConfigByName(llm_provider_name);

    // ! 这里的网络请求目前不会存库
    const models = await this.getModelsByProvider();

    const defaultCharacter = await cache.get("character");
    const model = await cache.get("current_model_name");
    const conversations = await this.getConversationList();
    const conversation = await this.getCurrentConversation();
    const defaultAdvanceOptions = await this.cache.get("defaultAdvanceOptions");

    return {
      conversation,
      conversations,
      model,
      provider: llm_provider_name,
      ...(providerConfig || {}),
      models,
      character: defaultCharacter,
      defaultAdvanceOptions,
    };
  }

  // 没用到，权限太大，暂不提供
  // async setConversations(conversations: any[]) {
  //   const { cache, lodash } = this;
  //   await cache.set("conversations", lodash.cloneDeep(conversations));
  // }

  // [未对外暴露] 获取所有聊天列表(时间排序)
  async getConversationList() {
    const { cache } = this;
    const conversations = (await cache.get("conversations")) || [];
    return conversations.sort((a, b) => b.timeStamp - a.timeStamp);
  }

  // [未对外暴露] 获取指定id的对话上下文，内部重度依赖方法
  async getConversationById(id: string) {
    const { CommonError } = this;
    if (id) {
      const conversations = await this.getConversationList();
      const conversation = conversations.find((item) => item.id === id);
      return conversation;
    } else {
      throw new CommonError(`missing id`);
    }
  }

  // 获取当前聊天上下文
  async getCurrentConversation() {
    const { cache } = this;
    const currentConversationId = await cache.get("conversation");
    if (!currentConversationId) {
      return null;
    }
    return this.getConversationById(currentConversationId);
  }

  // 新增对话的业务方法，返回已增加的对话和上下文,减少前端心智负担
  async addConversation(conversation: any) {
    const { cache, uuidV4, lodash } = this;
    const uuid = uuidV4();
    const newConversation = lodash.cloneDeep({
      ...conversation,
      id: uuid,
      createTime: Date.now(), //! 应改为createTime
      chatHistory: [],
    });

    const conversations = await cache.get("conversations");
    await cache.set("conversations", [...conversations, newConversation]);
    await cache.set("conversation", uuid);

    return {
      conversations: await this.getConversationList(),
      conversationId: await cache.get("conversation"),
      conversation: await this.getConversationById(uuid),
    };
  }

  // 激活指定的聊天
  async setConversation(conversationId) {
    const { cache } = this;
    await cache.set("conversation", conversationId);
    return await this.getConversationById(conversationId);
  }

  // 不是update当前对话。update指定的聊天
  async updateConversation(conversationId: string, content) {
    const { CommonError } = this;
    if (!conversationId) {
      throw new CommonError(`Missing required field: ${conversationId}`);
    }

    const { cache } = this;
    const conversations = await cache.get("conversations");

    const updatedConversations = conversations.map((item) =>
      item.id === conversationId ? { ...item, ...content } : item,
    );

    await cache.set("conversations", updatedConversations);
    return updatedConversations;
  }

  // 更新当前对话的model , 如果当前没有，返回null
  async updateCurrentConversationModel(modelId) {
    const { cache } = this;
    const currentConversationId = await cache.get("conversation");
    if (!currentConversationId) {
      return null;
    }
    await this.updateConversation(currentConversationId, { model: modelId });
    return await this.getConversationById(currentConversationId);
  }

  //  发送消息时更新当前对话列表
  async addMessageToCurrentConversationHistory(message) {
    const { uuidV4 } = this;
    const uuid = uuidV4();
    const newMessage = {
      timeStamp: Date.now(),
      id: uuid,
      ...message,
    };

    const currentConversation = await this.getCurrentConversation();
    const { id, chatHistory = [] } = currentConversation;
    chatHistory.push(newMessage);
    await this.updateConversation(id, { chatHistory });
    return await this.getConversationById(id);
  }

  // 更新标题，暂未提供用户修改方法。所以是当前的
  async updateConversationTitle(title) {
    const { cache } = this;
    const currentConversationId = await cache.get("conversation");
    await this.updateConversation(currentConversationId, { title });
    return this.getConversationList();
  }

  // 删除对话
  async deleteConversation(conversationId) {
    const { cache } = this;
    const conversations = await this.getConversationList();
    const newConversations = conversations.filter(
      (item) => item.id !== conversationId,
    );
    await cache.set("conversation", "");
    await cache.set("conversations", newConversations);

    return { conversations: newConversations };
  }

  // 删除指定消息，返回删后最后一条用户消息
  async deleteMessageFromCurrentConversationHistory(messageId) {
    const currentConversation = await this.getCurrentConversation();
    const { id, chatHistory = [] } = currentConversation;
    const newChatHistory = chatHistory.filter((item) => item.id !== messageId);
    await this.updateConversation(id, { chatHistory: newChatHistory });
    return await this.getConversationById(id);
  }

  async removeMessageSinceCurrentConversationHistory(index) {
    const currentConversation = await this.getCurrentConversation();
    const { id, chatHistory = [] } = currentConversation;

    let lastUserMessageIndex = 0;
    for (let i = 0; i < index; i++) {
      // 找到用户的最后一条消息
      if (chatHistory[i].role === "user") {
        lastUserMessageIndex = i;
      }
    }
    const lastUserMessage = chatHistory[lastUserMessageIndex];
    const newChatHistory = chatHistory.slice(0, lastUserMessageIndex);
    await this.updateConversation(id, {
      chatHistory: newChatHistory,
    });
    return {
      lastUserMessage,
      updatedConversation: await this.getConversationById(id),
    };
  }

  // 配置当前对话，
  async updateConversationAdvanceSetting(advanceOptions) {
    const currentConversation = await this.getCurrentConversation();
    const newConversation = {
      ...currentConversation,
      advanceOptions,
    };
    const { id } = newConversation;
    await this.updateConversation(id, newConversation);
    return newConversation;
  }
}
