import ClientCache from "@/lib/clientCache";
import schema from "./schema";
import _, { last } from "lodash";
import { v4 } from "uuid";
import ComonError from "@/lib/comonError";

class CachePlugin {
  private cache: ClientCache;
  constructor() {
    this.cache = new ClientCache();
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

  // 初始化获取上下文
  async getChatContext() {
    const { cache } = this;

    const current_provider_name = await cache.get("current_provider_name");
    const modelsMap = await cache.get("models");
    const model = await cache.get("current_model_name");
    const conversations = await this.getConversations();
    const conversation = await this.getCurrentConversation();
    return {
      conversation,
      conversations,
      model,
      provider: current_provider_name,
      ...modelsMap[current_provider_name],
    };
  }

  async setConversations(conversations: any[]) {
    const { cache } = this;
    await cache.set("conversations", _.cloneDeep(conversations));
  }

  // 获取所有聊天列表
  async getConversations() {
    const { cache } = this;
    const conversations = (await cache.get("conversations")) || [];
    return conversations.sort((a, b) => b.timeStamp - a.timeStamp);
  }

  // 获取当前聊天上下文
  async getCurrentConversation() {
    const { cache } = this;
    const currentConversationId = await cache.get("conversation");
    if (!currentConversationId) {
      return null;
    }

    return this.getConversation(currentConversationId);
  }

  async getConversation(id: string) {
    const { cache } = this;
    if (id) {
      const conversations = await cache.get("conversations");
      const conversation = conversations.find((item) => item.id === id);
      return conversation;
    } else {
      throw new ComonError(`missing id`);
    }
  }

  // 新增对话的业务方法，返回已增加的对话和上下文,减少前端心智负担
  async addConversation(conversation: any) {
    const { cache } = this;
    const uuid = v4();
    const newConversation = _.cloneDeep({
      ...conversation,
      id: uuid,
      timeStamp: Date.now(),
      chatHistory: [],
    });

    const conversations = await cache.get("conversations");
    await cache.set("conversations", [...conversations, newConversation]);
    await cache.set("conversation", uuid);

    return {
      conversations: await this.getConversations(),
      conversationId: await cache.get("conversation"),
      conversation: await this.getConversation(uuid),
    };
  }

  async setConversation(conversationId) {
    const { cache } = this;
    await cache.set("conversation", conversationId);
    return await this.getConversation(conversationId);
  }

  // 不是update当前对话
  async updateConversation(conversationId: string, content) {
    if (!conversationId) {
      throw new ComonError(`Missing required field: ${conversationId}`);
    }

    const { cache } = this;
    const conversations = await cache.get("conversations");

    const updatedConversations = conversations.map((item) =>
      item.id === conversationId ? { ...item, ...content } : item,
    );

    await cache.set("conversations", updatedConversations);
  }

  //  发送消息时更新当前对话列表
  async addMessageToCurrenConversationHistory(messsage) {
    const uuid = v4();
    const newMessage = {
      timeStamp: Date.now(),
      id: uuid,
      ...messsage,
    };

    const currentCoversation = await this.getCurrentConversation();
    const { id, chatHistory = [] } = currentCoversation;
    chatHistory.push(newMessage);
    await this.updateConversation(id, { chatHistory });
    return await this.getConversation(id);
  }

  async updateConversationModel(modelId) {
    const { cache } = this;
    const currentConversationId = await cache.get("conversation");
    await this.updateConversation(currentConversationId, { model: modelId });
    return this.getConversation(currentConversationId);
  }

  async updateConversationTitle(title) {
    const { cache } = this;
    const currentConversationId = await cache.get("conversation");
    await this.updateConversation(currentConversationId, { title });
    return this.getConversations();
  }

  async deleteConversation(conversationId) {
    const { cache } = this;
    const conversations = await this.getConversations();
    const newConversations = conversations.filter(
      (item) => item.id !== conversationId,
    );
    await cache.set("conversation", "");
    await cache.set("conversations", newConversations);

    return { conversations: newConversations };
  }

  async deleteMessageFromCurrenConversationHistory(messageId) {
    const currentCoversation = await this.getCurrentConversation();
    const { id, chatHistory = [] } = currentCoversation;
    const newChatHistory = chatHistory.filter((item) => item.id !== messageId);
    await this.updateConversation(id, { chatHistory: newChatHistory });
    return await this.getConversation(id);
  }

  async removeMessageSinceCurrenConversationHistory(index) {
    const currentCoversation = await this.getCurrentConversation();
    const { chatHistory = [] } = currentCoversation;

    let lastUserMessageIndex = 0;
    for (let i = 0; i < index; i++) {
      // 找到用户的最后一条消息
      if (chatHistory[i].role === "user") {
        lastUserMessageIndex = i;
      }
    }
    const lastUserMessage = chatHistory[lastUserMessageIndex];
    const newChatHistory = chatHistory.slice(0, lastUserMessageIndex);
    await this.updateConversation(currentCoversation.id, {
      chatHistory: newChatHistory,
    });
    return {
      lastUserMessage,
      updatedConversation: await this.getConversation(currentCoversation.id),
    };
  }

  async clearAllCache() {
    const { cache } = this;
    await cache.clear();
  }
}

export default new CachePlugin();
export type { ChatMessage } from "./schema";
export type ChatContext = {
  provider: string;
  conversation?: any;
  conversations?: any[]; // Add the conversations property
  model: string | undefined;
  URLs: {
    models: string;
  };
  systemPrompt?: string;
};
