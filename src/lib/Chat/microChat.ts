import _ from "lodash";
import CommonError from "@/lib/CommonError";
import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
} from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { v4 as uuid } from "uuid";
import createClient from "./utils/createClient";
import { baseSystemPrompt } from "./prompts/system";
import type { ChatClient, ProviderName } from "./types";
import formatChatHistory from "./utils/formatChatHistory";
import cachePlugin from "@/plugins/cachePlugin";
import message from "../message";
import type { AdvanceOptions } from "@/plugins/cachePlugin/types";

// “微”任务模型，与状态解耦,与db直接交互
interface ClientConfig {
  provider: ProviderName;
  model: string;
  client: "default";
  systemMessage?: string;
  advanceOptions: AdvanceOptions;
  memory: boolean | number;
  userMessageTemplate: (userMessage: string) => string;
  systemMessageTemplate?: (systemMessage: string) => string;
  onError?: (errorMessage: string, error) => void;
}

class MicroChat {
  private client?: ChatClient;
  private clientConfig: ClientConfig;
  private chatHistory: any[] = [];
  private app: any;
  private sendMessageController?: AbortController | null;

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
        // this.useConfig(config);
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
    this.initChain();
  }

  abort() {
    this.sendMessageController?.abort();
    this.sendMessageController = null;
  }

  async useTool() {}

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

    this.app = chatPrompt
      .pipe(client)
      // .pipe(
      //   new RunnableLambda({
      //     func(state) {
      //       console.log("state", state, this);
      //       return state;
      //     },
      //   }),
      // )
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

  // 更新聊天历史
  async updateChatHistory(userTemplateConfig) {
    // 用户消息格式化并push
    const { userMessageTemplate, memory } = this.clientConfig;

    if (!memory) {
      this.clearHistory();
    }

    const formateUserMessage = userMessageTemplate(userTemplateConfig);
    this.chatHistory.push({
      role: "user",
      content: formateUserMessage,
    });

    if (typeof memory === "number") {
      this.chatHistory = this.chatHistory.slice(-memory);
    }

    // console.error("this.chatHistory", this.clientConfig);
    // 根据maxTokens 截断历史
    const messages = await formatChatHistory({
      provider: this.clientConfig?.provider,
      chatHistory: this.chatHistory,
      maxTokens: this.clientConfig?.advanceOptions?.maxTokens,
    });

    return messages;
  }

  // 发消息，流式输出
  async invoke(userTemplateConfig) {
    const messages = await this.updateChatHistory(userTemplateConfig);
    this.beforeInvoke();

    // 打断发送
    const config = {
      signal: this.sendMessageController?.signal,
    };

    const chatContext = {
      messages,
    };

    // return;
    const result = await this.app.invoke(chatContext, config);
    this.chatHistory.push({ role: "assistant", content: result });
    // console.error("result", result);

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
