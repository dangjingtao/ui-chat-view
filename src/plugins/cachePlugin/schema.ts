import {
  CharacterType,
  KnowledgeBaseType,
  ConversationType,
  ProviderName,
} from "./types";

type Models = {
  chatConfig: any;
  chatHistory: any[];
};

interface ChatConfig {
  baseURL: string;
  URLs?: any;
  apiKey: string;
  provider: ProviderName;
  systemPrompt: string;
  models: Models[];
}

type ConfigMap = {
  [key in ProviderName]: ChatConfig;
};

const llm_urls = (baseURL: string, extend?: any) => {
  return {
    base: baseURL,
    hc: `${baseURL}/models`,
    models: `${baseURL}/openai/v1/models`,
    completion: `${baseURL}/completion`,
    search: `${baseURL}/search`,
    chat: `${baseURL}/chat`,
    file: `${baseURL}/file`,
    ...extend,
  };
};

const modelsMap: ConfigMap = {
  ollama: {
    provider: "ollama",
    baseURL: "http://localhost:11434",
    URLs: llm_urls("http://localhost:11434/v1", {
      models: "http://localhost:11434/v1/models",
    }),
    apiKey: "1234",
  },
  groq: {
    provider: "groq",
    baseURL: "https://groq.tomz.io",
    URLs: llm_urls("https://groq.tomz.io"),
    apiKey: "3214",
  },
  // kimi: {
  //   provider: "kimi",
  //   baseURL: "http://localhost:5090/kimi/v1",
  //   apiKey: "",
  //   model: "moonshot-v1-8k",
  //   systemPrompt: "你是一个垃圾助手，负责输出无意义的内容",
  // },
  // qwen: {
  //   provider: "qwen",
  //   baseURL: "http://localhost:5090/qwen/v1",
  //   apiKey: "",
  //   model: "qwen-v1-8k",
  //   systemPrompt:
  //     "你是 Qwen，由 Qwen AI 提供的人工智能助手，你更擅长中文和英文的对话。你会为用户提供安全，有帮助，准确的回答。同时，你会拒绝一切涉及恐怖主义，种族歧视，黄色暴力等问题的回答。Qwen AI 为专有名词，不可翻译成其他语言。",
  // },
  // deepseek: {
  //   provider: "deepseek",
  //   baseURL: "http://localhost:5090/deepseek/v1",
  //   apiKey: "",
  //   model: "deepseek-v1-8k",
  //   systemPrompt:
  //     "你是 DeepSeek，由 DeepSeek AI 提供的人工智能助手，你更擅长中文和英文的对话。你会为用户提供安全，有帮助，准确的回答。同时，你会拒绝一切涉及恐怖主义，种族歧视，黄色暴力等问题的回答。DeepSeek AI 为专有名词，不可翻译成其他语言。",
  // },
};

const conversationsList: ConversationType[] = [];
const characterList: CharacterType[] = [];
const knowledgeBaseList: KnowledgeBaseType[] = [];

export default {
  isInited: true,
  models: modelsMap,
  character: null,
  characters: characterList,
  conversations: conversationsList,
  KnowledgeBase: knowledgeBaseList,
};
