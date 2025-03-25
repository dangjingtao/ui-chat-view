import _ from "lodash";
import CommonError from "@/lib/CommonError";
import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
} from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import createClient from "./utils/createClient";
import { baseSystemPrompt } from "./prompts/system";
import type { ChatClient, ProviderName } from "./types";
import formatChatHistory from "./utils/formatChatHistory";
import cachePlugin from "@/plugins/cachePlugin";
import message from "../message";
import type { AdvanceOptions } from "@/plugins/cachePlugin/types";
import { v4 as uuid } from "uuid";
import createEmbeddingClient from "./utils/createEmbedding";
import { RunnableLambda } from "@langchain/core/runnables";
import { getTools } from "./utils/tools";

// “微”任务模型，与状态解耦,与db直接交互
interface ClientConfig {
  provider: ProviderName;
  model: string;
  client: "default";
  systemMessage?: string;
  advanceOptions: AdvanceOptions;
  memory: boolean | number;
  tools?: any[];
  userMessageTemplate: (any) => string;
  systemMessageTemplate?: (any) => string;
  onError?: (errorMessage: string, error) => void;
}

class MicroChat {
  private client?: ChatClient;
  private clientConfig: ClientConfig;
  private chatHistory: any[] = [];
  private app: any;
  private embeddingClient?: any;
  private sendMessageController?: AbortController | null;
  private tools: any[] = [];

  constructor() {
    this.clientConfig = {} as ClientConfig;
  }

  private onError(errMessage, error?: any) {
    const { onError } = this.clientConfig || {};
    if (onError) {
      onError(errMessage, error);
    } else {
      message.error(errMessage);
      throw new CommonError(errMessage, error);
    }
  }

  // 抛错模块，用于检查是否有必要的配置
  private validConfig(config: ClientConfig) {
    const { client } = config;
    if (client !== "default") {
      const requiredFields = ["baseURL", "apiKey", "provider", "model"];
      requiredFields.forEach((field) => {
        if (!config[field]) {
          this.onError(`${field} is required`);
        }
      });
    } else {
      // todo
    }
  }

  // 使用客户端
  private async useClient(config: ClientConfig) {
    try {
      const { client = "default", advanceOptions = {} } = config;
      // 如果client是default，那么就使用默认的任务模型，一般来说都是默认的任务模型
      if (client === "default") {
        const provider = await cachePlugin.getTaskLLMProvider();
        const model = await cachePlugin.getTaskLLMModel();
        const modelConfig = await cachePlugin.getProviderConfigByName(provider);
        this.client = createClient(
          provider,
          model,
          (modelConfig as { baseURL: string }).baseURL,
          advanceOptions,
        );

        this.clientConfig.provider = provider;
        this.clientConfig.model = model;

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
      } else {
        // todo
        // 如果不是default，那么就使用自定义的任务模型
        // this.useConfig(config);
      }
    } catch (error) {
      this.onError("Failed to initialize client", error);
    }
  }

  async usePlugin(config: ClientConfig) {
    this.validConfig(config);
    this.clientConfig = config;
    await this.useClient(config);
    await this.useTools(config.tools);
    this.initChain();
  }

  abort() {
    this.sendMessageController?.abort();
    this.sendMessageController = null;
  }

  async useTools(inputTools) {
    // 创建 Function 实例
    const tools = getTools({
      client: this.client,
      embeddingClient: this.embeddingClient,
      inputTools,
    });

    this.client = this.client?.bindTools(tools);
    //除了要绑定工具，还要绑定工具到this
    this.tools = tools;
  }

  clearHistory() {
    this.chatHistory = [];
  }

  getHistory() {
    return this.chatHistory;
  }

  // 初始化链条，设置提示词模板和解析器
  initChain() {
    const { client, clientConfig } = this;

    if (!client) {
      throw new Error("Client not initialized");
    }

    const { systemMessage = baseSystemPrompt } = clientConfig;

    // 将会是一个空提示词模板如果用户不给
    const formateSystemMessage =
      SystemMessagePromptTemplate.fromTemplate(systemMessage);
    const chatPrompt = ChatPromptTemplate.fromMessages([
      formateSystemMessage,
      ["placeholder", "{messages}"],
    ]);

    const parser = new StringOutputParser();

    // console.error("this.client", this.client);
    this.app = chatPrompt
      .pipe(client)
      .pipe(
        new RunnableLambda({
          func: async (state, ...args) => {
            const { tool_calls = [] } = state;
            if (tool_calls.length) {
              try {
                // 使用 Promise.allSettled 并行处理工具调用
                const toolMessages = await Promise.allSettled(
                  tool_calls.map(async (toolCall) => {
                    const selectedTool = this.tools.find(
                      (item) => item.name === toolCall.name,
                    );
                    if (selectedTool) {
                      return selectedTool.invoke(toolCall);
                    } else {
                      message.error(`Tool not found: ${toolCall.name}`);
                      throw new Error(`Tool not found: ${toolCall.name}`);
                    }
                  }),
                );

                // 处理工具调用结果
                const fulfilledToolMessages = toolMessages
                  .filter((result) => result.status === "fulfilled")
                  .map(
                    (result) => (result as PromiseFulfilledResult<any>).value,
                  );

                const chatHistory = await this.getFormatChatHistory();
                chatHistory.push(state);
                chatHistory.push(...fulfilledToolMessages);
                return await client?.invoke(chatHistory);
              } catch (error) {
                if (error instanceof Error) {
                  message.error(`Failed to invoke tool: ${error.message}`);
                } else {
                  message.error("Failed to invoke tool: Unknown error");
                }
                return state;
              }
            }

            return state;
          },
        }),
      )
      .pipe(parser);
  }

  // 提示词解析不能直接使用，需要先进行处理，但是否需要加入历史？
  async beforeInvoke() {
    const { app } = this;
    if (!app) {
      throw new Error("App not initialized");
    }
    this.sendMessageController = new AbortController();
  }

  // 参数是未格式化的聊天记录
  async getFormatChatHistory(originalChatHistory?) {
    const { provider, advanceOptions = {} } = this.clientConfig;
    const { maxTokens = 8192 } = advanceOptions;
    const chatHistory = originalChatHistory || this.chatHistory;

    return await formatChatHistory({
      provider,
      maxTokens,
      chatHistory,
    });
  }

  // 更新聊天历史
  async updateChatHistory(userTemplateConfig) {
    // 用户消息格式化并push
    const { userMessageTemplate, memory } = this.clientConfig;

    const formateUserMessage = userMessageTemplate(userTemplateConfig);
    this.chatHistory.push({
      role: "user",
      content: formateUserMessage,
    });

    if (!memory) {
      return await this.getFormatChatHistory();
    }

    if (typeof memory === "number") {
      const slicedChatHistory = this.chatHistory.slice(-memory);
      const messages = await this.getFormatChatHistory(slicedChatHistory);
      return messages;
    }

    // todo
  }

  // 发消息，流式输出
  async invoke(userTemplateConfig) {
    const messages = await this.updateChatHistory(userTemplateConfig);
    this.beforeInvoke();
    // console.error(messages);
    // return;

    // 打断发送
    const config = {
      signal: this.sendMessageController?.signal,
    };

    const chatContext = {
      messages,
    };

    let result = "";
    // return;
    try {
      result = await this.app.invoke(chatContext, config);
    } catch (error) {
      message.error(`Failed to invoke: ${error.message}`);
    }
    this.chatHistory.push({ role: "assistant", content: result });

    return {
      role: "assistant",
      result,
      content: "",
      createTime: Date.now(),
      id: uuid(),
    };
  }
}

export default new MicroChat();
