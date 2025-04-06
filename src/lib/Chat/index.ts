import { ChatOpenAI } from "@langchain/openai";
import { ChatOllama } from "@langchain/ollama";
import { ChatGroq } from "@langchain/groq";
import _ from "lodash";
import CommonError from "@/lib/CommonError";
import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
} from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { v4 as uuid } from "uuid";
import prompts from "@/dataSet/prompts.json";
// 工具
import createClient from "./utils/createClient";
import { baseSystemPrompt, genConversationTitlePrompt } from "./prompts/system";
import { defaultAdvanceOptions } from "@/plugins/cachePlugin/schema.ts"; // 绕过了协议
import { removeThinkContent } from "@/lib/textProcessor/answerParser";
import { getTools, withCallTools } from "./utils/tools";
import formatChatHistory from "./utils/formatChatHistory";
import createEmbeddingClient from "./utils/createEmbedding";

import cachePlugin from "@/plugins/cachePlugin";
import type { AIMessage } from "@langchain/core/messages";
import type { RunnableLambda } from "@langchain/core/runnables";

type ProviderName =
  | "kimi"
  | "qwen"
  | "deepseek"
  | "groq"
  | "ollama"
  | "openai"
  | "";

interface ChatConfig {
  baseURL: string;
  apiKey: string;
  provider: ProviderName;
  systemPrompt: string;
  model: string;
  customerBaseURL?: string; // Add this line
}

class Chat {
  private client?: ChatOpenAI | ChatOllama | ChatGroq | null;
  private provider?: ProviderName;
  private clientConfig?: ChatConfig;
  private chatHistory: any[] = [];
  private app: any;
  private miniApp: any;
  private sendMessageController?: AbortController | null;
  private embeddingClient?: any;
  public tools: any[] = [];
  private callTool?: RunnableLambda<AIMessage, any, any>; // Update callTool type

  constructor() {}

  // 抛错模块，用于检查是否有必要的配置
  private validConfig() {
    if (!this.clientConfig) {
      throw new Error("Client not initialized");
    }
    const { provider, model, baseURL, customerBaseURL } = this.clientConfig;

    const requiredFields = {
      provider,
      model,
      baseURL: customerBaseURL || baseURL,
    };
    for (const [key, value] of Object.entries(requiredFields)) {
      if (!value) {
        throw new CommonError(`Missing required field: ${key}`, {
          code: key,
          key,
          value,
        });
      }
    }
  }

  use(config: any) {
    this.clientConfig = config;
    this.init();
  }

  init() {
    const { chatHistory = [], tools = [] } = this.clientConfig;
    this.clientConfig.advanceOptions =
      this.clientConfig.advanceOptions || defaultAdvanceOptions;

    this.validConfig();
    this.chatHistory = chatHistory;

    this.useClient();
    this.useTools(tools);
    this.useStructuredModel();
    this.initChain();

    this.initMiniPermissionChain(this.client);

    return this;
  }

  /**
   * 工具
   * @param inputTools
   * @returns
   */
  async useTools(inputTools) {
    // 只是处理useTool逻辑
    this.callTool = withCallTools(this);

    if (!inputTools || !inputTools?.length) {
      return;
    }

    const tools = getTools({
      client: this.client,
      embeddingClient: this.embeddingClient,
      inputTools,
    });

    this.client = this.client?.bindTools(tools) as
      | ChatOpenAI
      | ChatOllama
      | ChatGroq
      | null;
    this.tools = tools;
  }

  async useClient() {
    // 创建主聊天模型
    const { provider, model, baseURL, advanceOptions, customerBaseURL } =
      this.clientConfig;
    const domain = customerBaseURL || baseURL;

    const client = createClient(provider, model, domain, advanceOptions);
    client.model = model;
    this.client = client;

    // 创建向量模型
    const taskEmbeddingProvider = await cachePlugin.getTaskEmbedProvider();
    const taskEmbeddingModel = await cachePlugin.getTaskEmbedModel();
    const embedModelConfig = await cachePlugin.getProviderConfigByName(
      taskEmbeddingProvider,
    );

    this.embeddingClient = createEmbeddingClient(
      taskEmbeddingProvider,
      taskEmbeddingModel,
      (embedModelConfig as { baseURL: string }).baseURL,
    );
  }

  useStructuredModel() {
    // console.error(this.client);
    // this.client = this.client.withStructuredOutput(joke);
  }

  clearHistory() {
    this.chatHistory = [];
  }

  getHistory() {
    return this.chatHistory;
  }

  abort() {
    this.sendMessageController?.abort();
    this.sendMessageController = null;
  }

  // 微任务模型：生成标题
  initMiniPermissionChain(client) {
    const systemMessage = SystemMessagePromptTemplate.fromTemplate(
      genConversationTitlePrompt(),
    );

    const chatPrompt = ChatPromptTemplate.fromMessages([
      systemMessage,
      ["placeholder", "{messages}"],
    ]);

    const parser = new StringOutputParser();

    this.miniApp = chatPrompt.pipe(client).pipe(parser);
  }

  // 参数是未格式化的聊天记录
  async getFormatChatHistory(originalChatHistory?) {
    const { provider, advanceOptions = {} } = this.clientConfig || {};
    const { maxTokens = 8192 } = advanceOptions;
    const chatHistory = originalChatHistory || this.chatHistory;

    return await formatChatHistory({
      provider,
      maxTokens,
      chatHistory,
    });
  }

  initChain() {
    const { client } = this;
    const systemMessage = SystemMessagePromptTemplate.fromTemplate(
      `${baseSystemPrompt} {userSystemMessage}`,
    );
    const chatPrompt = ChatPromptTemplate.fromMessages([
      systemMessage,
      ["placeholder", "{messages}"],
    ]);

    const parser = new StringOutputParser();

    if (!client) {
      throw new Error("Client not initialized");
    }

    if (!this.callTool) {
      throw new Error("callTool is not initialized");
    }

    this.app = chatPrompt.pipe(client).pipe(this.callTool).pipe(parser);
  }

  // 获取最近一条用户信息
  getLastUserMessage() {
    const lastUserMessage = this.chatHistory
      .slice()
      .reverse()
      .find((item) => item.role === "user");
    return lastUserMessage;
  }

  // 生成对话标题
  async generateTitle(chatContext) {
    if (chatContext.messages.length > 0 && chatContext.messages.length < 3) {
      // 生成对话标题
      return removeThinkContent(
        await this.miniApp.invoke({
          messages: [
            {
              role: "user",
              content: removeThinkContent(
                chatContext.messages[chatContext.messages.length - 1].content,
              ),
            },
          ],
        }),
      );
    }
    return "";
  }

  // 解析指令
  getSystemMessageFromDirective(directive) {
    // 注入用户自己写的提示词.优先度最高
    if (this.clientConfig?.advanceOptions?.systemPrompt) {
      return this.clientConfig?.advanceOptions.systemPrompt;
    }

    const systemPrompt = directive.find(
      (item) => item.name === "system_prompt",
    );
    const id = Number(systemPrompt?.props?.id);

    if (id) {
      const info = prompts.find((item) => item.id === id);
      return info?.zh?.prompt || "";
    }

    return "";
  }

  // 提示词解析不能直接使用，需要先进行处理，但是否需要加入历史？
  async beforeSendMessage() {
    const { app } = this;
    if (!app) {
      throw new Error("App not initialized");
    }
    this.sendMessageController = new AbortController();
  }

  // 发消息，流式输出
  async sendMessage() {
    await this.beforeSendMessage();

    // 打断发送
    const config = {
      signal: this.sendMessageController?.signal,
    };

    const lastUserMessage = this.getLastUserMessage();
    const { directive = [] } = lastUserMessage;

    // 用户追加的提示词
    const userSystemMessage = this.getSystemMessageFromDirective(directive);

    // 最近的n条记录：
    const recentChatHistory = this.chatHistory.slice(
      -this.clientConfig.advanceOptions.context,
    );

    // 在发送之前设置消息修剪
    // console.error("recentChatHistory", recentChatHistory);
    const messages = await this.getFormatChatHistory(recentChatHistory);

    const chatContext = {
      messages,
      userSystemMessage,
    };

    // return;
    const stream = await this.app.invoke(chatContext, config);
    const title = await this.generateTitle(chatContext);

    return {
      title,
      role: "assistant",
      stream,
      content: "",
      timeStamp: Date.now(),
      id: uuid(),
    };
  }
}

export default Chat;
