import { ChatOpenAI } from "@langchain/openai";
import { ChatOllama, Ollama } from "@langchain/ollama";
import { ChatGroq } from "@langchain/groq";
import _ from "lodash";
import {
  HumanMessage,
  SystemMessage,
  AIMessage,
} from "@langchain/core/messages";
import ComonError from "@/lib/comonError";
import {
  START,
  END,
  MessagesAnnotation,
  StateGraph,
  Annotation,
} from "@langchain/langgraph/web";
import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
} from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { v4 as uuid } from "uuid";
import { RunnableSequence, RunnableLambda } from "@langchain/core/runnables";
import promptParser from "@/lib/promptParser";
import prompts from "@/dataSet/prompts.json";

type ProviderName =
  | "kimi"
  | "qwen"
  | "deepseek"
  | "groq"
  | "ollama"
  | "openai"
  | "";

interface ChatConfig {
  URLs: any;
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
  private clientMap: any;

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
    const { provider, model, URLs, apiKey } = this.clientConfig;

    const requiredFields = { provider, model, URLs };
    for (const [key, value] of Object.entries(requiredFields)) {
      if (!value) {
        throw new ComonError(`Missing required field: ${key}`, {
          code: key,
          key,
          value,
        });
      }
    }
  }

  init() {
    const { provider, model, URLs, apiKey, chatHistory } = this.clientConfig;
    this.validConfig();
    this.chatHistory = chatHistory || [];
    this.clientMap = this.clientMap || {};
    if (!this.clientMap[provider]) {
      let client: any = null;
      switch (provider) {
        case "ollama":
          client = new ChatOllama({
            model: model,
            streaming: true,
          });
          break;
        case "groq":
          client = new ChatGroq({
            model,
            baseUrl: URLs.base,
            apiKey: apiKey,
          });
          break;
        default:
          client = new ChatOpenAI({
            configuration: {
              baseURL: URLs.base,
            },
            apiKey: apiKey,
          });
      }
      client.model = model;
      this.clientMap[provider] = client;
      this.client = client;
    } else {
      this.clientMap[provider].model = model;
      this.client = this.clientMap[provider];
    }

    this.initChain(this.client);
    this.initMiniPermissionChain(this.client);

    return this;
  }

  clearHistory() {
    this.chatHistory = [];
  }

  getHistory() {
    return this.chatHistory;
  }

  // 微任务模型
  initMiniPermissionChain(client) {
    const systemMessage = SystemMessagePromptTemplate.fromTemplate(
      "You are a useful assistant who is good at summarizing the current chat content in concise Chinese (no more than 20 words), and your reply only summarizes the user's chat content.",
    );
    const chatPrompt = ChatPromptTemplate.fromMessages([
      systemMessage,
      ["placeholder", "{messages}"],
    ]);

    const parser = new StringOutputParser();

    this.miniApp = chatPrompt.pipe(client).pipe(parser);
  }

  initChain(client) {
    const systemMessage = SystemMessagePromptTemplate.fromTemplate(
      "You are a helpful assistant. Answer all questions to the best of your ability in {language}. {userSystemMessage}",
    );
    const chatPrompt = ChatPromptTemplate.fromMessages([
      systemMessage,
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

  formatChatHistory() {
    console.log("chatHistory", this.chatHistory);
    const chst = this.chatHistory.map((item) => {
      if (item.role === "assistant") {
        return new AIMessage(item.content || "");
      } else {
        return new HumanMessage(item.content || "");
      }
    });
    return chst;
  }

  // 获取最近一条用户信息
  getLastUserMessage() {
    const lastUserMessage = this.chatHistory
      .slice()
      .reverse()
      .find((item) => item.role === "user");
    return lastUserMessage;
  }

  // 提示词解析不能直接使用，需要先进行处理，但是否需要加入历史？
  async beforeSendMessage() {
    const { app } = this;
    if (!app) {
      throw new Error("App not initialized");
    }
  }

  async genateTitle(chatContext) {
    if (chatContext.messages.length > 0 && chatContext.messages.length < 2) {
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

  getSystmeMessagefromDirective(directive) {
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
  async sendMessage() {
    await this.beforeSendMessage();
    const config = {};
    const lastUserMessage = this.getLastUserMessage();
    const { directive = [] } = lastUserMessage;
    const userSystemMessage = this.getSystmeMessagefromDirective(directive);
    const chatContext = {
      messages: this.chatHistory,
      language: "Chinese",
      userSystemMessage,
    };
    const stream = await this.app.stream(chatContext, config);
    const title = await this.genateTitle(chatContext);

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
