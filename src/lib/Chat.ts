import { ChatOpenAI } from "@langchain/openai";
import { ChatOllama } from "@langchain/ollama";
import { ChatGroq } from "@langchain/groq";
import _ from "lodash";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import type OpenAI from "openai";

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

type ConfigMap = {
  [key in ProviderName]: ChatConfig;
};

const configMap: ConfigMap = {
  groq: {
    provider: "groq",
    baseURL: "https://groq.tomz.io/openai/v1",
    apiKey: "",
    model: "deepseek-r1-distill-qwen-32b",
    systemPrompt: "你是一个有用的助手",
  },
  kimi: {
    provider: "kimi",
    baseURL: "http://localhost:5090/kimi/v1",
    apiKey: "",
    model: "moonshot-v1-8k",
    systemPrompt:
      "你是 Kimi，由 Moonshot AI 提供的人工智能助手，你更擅长中文和英文的对话。你会为用户提供安全，有帮助，准确的回答。同时，你会拒绝一切涉及恐怖主义，种族歧视，黄色暴力等问题的回答。Moonshot AI 为专有名词，不可翻译成其他语言。",
  },
  qwen: {
    provider: "qwen",
    baseURL: "http://localhost:5090/qwen/v1",
    apiKey: "",
    model: "qwen-v1-8k",
    systemPrompt:
      "你是 Qwen，由 Qwen AI 提供的人工智能助手，你更擅长中文和英文的对话。你会为用户提供安全，有帮助，准确的回答。同时，你会拒绝一切涉及恐怖主义，种族歧视，黄色暴力等问题的回答。Qwen AI 为专有名词，不可翻译成其他语言。",
  },
  deepseek: {
    provider: "deepseek",
    baseURL: "http://localhost:5090/deepseek/v1",
    apiKey: "",
    model: "deepseek-v1-8k",
    systemPrompt:
      "你是 DeepSeek，由 DeepSeek AI 提供的人工智能助手，你更擅长中文和英文的对话。你会为用户提供安全，有帮助，准确的回答。同时，你会拒绝一切涉及恐怖主义，种族歧视，黄色暴力等问题的回答。DeepSeek AI 为专有名词，不可翻译成其他语言。",
  },
};

class Chat {
  private client?: ChatOpenAI | ChatOllama | ChatGroq | OpenAI | null;
  private provider?: ProviderName;
  private clientConfig?: ChatConfig;
  private chatHistory: any[] = [];

  constructor() {}

  use(config: any) {
    this.clientConfig = _.merge(this.clientConfig, config);
    return this;
  }

  private validConfig() {
    if (!this.clientConfig) {
      throw new Error("Client not initialized");
    }
    const { provider, model, URLs, apiKey } = this.clientConfig;

    const requiredFields = { provider, model, URLs };
    for (const [key, value] of Object.entries(requiredFields)) {
      if (!value) {
        throw new Error(
          `${key.charAt(0).toUpperCase() + key.slice(1)} not set`,
        );
      }
    }
  }

  init() {
    const { provider, model, URLs, apiKey, chatHistory } = this.clientConfig;
    this.validConfig();
    switch (provider) {
      case "ollama":
        this.client = new ChatOllama({
          model: model,
        });
        break;
      case "groq":
        this.client = new ChatGroq({
          baseUrl: URLs.base,
          apiKey: apiKey,
        });
        break;
      default:
        this.client = new ChatOpenAI({
          configuration: {
            baseURL: URLs.base,
          },
          apiKey: apiKey,
        });
    }
    console.log(this.client);

    return this;
  }

  clearHistory() {
    this.chatHistory = [];
  }

  getHistory() {
    return this.chatHistory;
  }

  async sendMessage(message: string) {
    const { clientConfig } = this;
    const { systemPrompt } = clientConfig;

    if (this.chatHistory.length === 0) {
      this.chatHistory.push({
        role: "assistant",
        content: systemPrompt || "你是一个有用的助手",
      });
    }

    this.chatHistory.push(message);
    console.log(this.chatHistory);
    const chst = this.chatHistory.map((item) => {
      if (item.role === "assistant") {
        return new SystemMessage(item.content);
      } else {
        return new HumanMessage(item.content);
      }
    });
    const r = await this.client?.invoke(chst);
    console.log(r);

    return r;
  }
}

export default Chat;
