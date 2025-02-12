import OpenAI from "openai";

type ProviderName = "kimi" | "qwen" | "deepseek";

interface ChatConfig {
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
  private client?: OpenAI | null;
  private provider?: ProviderName;
  private clientConfig?: ChatConfig;
  private chatHistory: any[] = [];

  constructor(options?: ChatConfig) {
    if (options) {
      this.provider = options.provider;
      this.clientConfig = options;
      const { baseURL, apiKey } = options;
      this.client = new OpenAI({
        baseURL,
        apiKey,
        dangerouslyAllowBrowser: true,
      });
    }
  }

  use(provider: ProviderName) {
    this.provider = provider;
    this.clientConfig = configMap[this.provider];
    const { baseURL, apiKey } = this.clientConfig;
    this.client = new OpenAI({
      baseURL,
      apiKey,
      dangerouslyAllowBrowser: true,
    });
  }

  clearHistory() {
    this.chatHistory = [];
  }

  getHistory() {
    return this.chatHistory;
  }

  async sendMessage(message: string) {
    if (!this.client || !this.clientConfig) {
      throw new Error("Client not initialized");
    }

    const { clientConfig } = this;
    const { systemPrompt, model } = clientConfig;

    if (this.chatHistory.length === 0) {
      this.chatHistory.push(systemPrompt);
    }

    this.chatHistory.push(message);

    const completion = await this.client.chat.completions.create({
      model: model,
      messages: this.chatHistory,
      temperature: 0.3,
    });

    return this.reply(completion);
  }

  async reply(completion: any) {
    const { choices } = completion;
    const { message } = choices[0];
    return message;
  }
}

export default Chat;
