import { ChatOpenAI } from "@langchain/openai";
import { ChatOllama, Ollama } from "@langchain/ollama";
import { ChatCohere } from "@langchain/cohere";
import { ChatDeepSeek } from "@langchain/deepseek";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatGroq } from "@langchain/groq";
import { CohereClient } from "cohere-ai";
import _ from "lodash";
import {
  HumanMessage,
  SystemMessage,
  AIMessage,
} from "@langchain/core/messages";
import CommonError from "@/lib/CommonError";
import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
} from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { v4 as uuid } from "uuid";
import { RunnableSequence, RunnableLambda } from "@langchain/core/runnables";
import promptParser from "@/lib/textProcessor/promptParser";
import prompts from "@/dataSet/prompts.json";
// 工具
import calculatorTool from "./tools/calculator";
import { Calculator } from "@langchain/community/tools/calculator";
import { WebBrowser } from "langchain/tools/webbrowser";
import { SerpAPI } from "@langchain/community/tools/serpapi";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import webBrowserTool from "./tools/webBroswer";
import createClient from "./utils/createClient";
import { getLanguage } from "@/i18n";
import { baseSystemPrompt, genConversationTitlePrompt } from "./prompts/system";
import { defaultAdvanceOptions } from "@/plugins/cachePlugin/schema.ts"; // 绕过了协议

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
}

class Chat {
  private client?: ChatOpenAI | ChatOllama | ChatGroq | null;
  private provider?: ProviderName;
  private clientConfig?: ChatConfig;
  private chatHistory: any[] = [];
  private app: any;
  private miniApp: any;
  private clientMap: any;
  private sendMessageController?: AbortController | null;

  constructor() {}

  use(config: any) {
    this.clientConfig = config;
    return this;
  }

  // 抛错模块，用于检查是否有必要的配置
  private validConfig() {
    if (!this.clientConfig) {
      throw new Error("Client not initialized");
    }
    const { provider, model, baseURL } = this.clientConfig;

    const requiredFields = { provider, model, baseURL };
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

  abort() {
    this.sendMessageController?.abort();
    this.sendMessageController = null;
  }

  async useTool() {
    const tools = [
      new Calculator(),
      webBrowserTool(this.client, "nomic-embed-text:v1.5"),
    ];
    this.client?.bindTools(tools);

    initializeAgentExecutorWithOptions(tools, model, {
      agentType: "zero-shot-react-description",
      verbose: true,
    });
  }

  useClient() {
    const { provider, model, baseURL, advanceOptions } = this.clientConfig;

    const client = createClient(provider, model, baseURL, advanceOptions);
    client.model = model;

    this.client = client;
  }

  init() {
    const { chatHistory = [] } = this.clientConfig;
    this.clientConfig.advanceOptions =
      this.clientConfig.advanceOptions || defaultAdvanceOptions;

    this.validConfig();
    this.chatHistory = chatHistory;

    this.useClient();
    this.initChain();
    //
    this.initMiniPermissionChain(this.client);

    return this;
  }

  clearHistory() {
    this.chatHistory = [];
  }

  getHistory() {
    return this.chatHistory;
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

  formatChatHistory() {
    return this.chatHistory.map((item) => {
      if (item.role === "assistant") {
        return new AIMessage(item.content || "");
      } else {
        return new HumanMessage(item.content || "");
      }
    });
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
    if (chatContext.messages.length > 0 || chatContext.messages.length < 3) {
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

    // 提示词修改逻辑
    const userSystemMessage = this.getSystemMessageFromDirective(directive);

    // 最近的n条记录：
    const recentChatHistory = this.chatHistory.slice(
      -this.clientConfig.advanceOptions.context,
    );

    // this.miniApp

    // 在发送之前设置消息修剪

    const chatContext = {
      messages: recentChatHistory,
      userSystemMessage,
    };

    const stream = await this.app.stream(chatContext, config);
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

export const extractThinkContent = (text: string): string[] => {
  const regex = /<think>(.*?)<\/think>/gs;
  const matches: string[] = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    matches.push(match[1]);
  }
  return matches;
};

export const removeThinkContent = (content) => {
  return content.replace(/<think>.*?<\/think>/gs, "");
};
