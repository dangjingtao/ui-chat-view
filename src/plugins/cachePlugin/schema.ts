import { ConversationConfig } from "./../../store/chat/index";
import { BASE_URL } from "@/config/index";
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
  apiKey?: string;
  provider: ProviderName;
  models?: Models[];
}

type ConfigMap = {
  [key in ProviderName]: ChatConfig;
};

const providersMap: ConfigMap = {
  ollama: {
    provider: "ollama",
    baseURL: "http://127.0.0.1:11434", // 保留本地地址不变
  },
  groq: {
    provider: "groq",
    baseURL: `${BASE_URL}groq`, // 使用模板字符串拼接
  },
  cohere: {
    provider: "cohere",
    baseURL: `${BASE_URL}cohere`,
  },
  kimi: {
    provider: "kimi",
    baseURL: `${BASE_URL}kimi`,
  },
  deepseek: {
    provider: "deepseek",
    baseURL: `${BASE_URL}deepseek`,
  },
  gemini: {
    provider: "gemini",
    baseURL: `${BASE_URL}gemini`,
  },
  cloudflare: {
    provider: "cloudflare",
    baseURL: `${BASE_URL}cloudflare`,
  },

  // qwen: {
  //   provider: "qwen",
  //   baseURL: "http://localhost:5090/qwen/v1",
  //   apiKey: "",
  //   model: "qwen-v1-8k",
  //   systemPrompt:
  //     "你是 Qwen，由 Qwen AI 提供的人工智能助手，你更擅长中文和英文的对话。你会为用户提供安全，有帮助，准确的回答。同时，你会拒绝一切涉及恐怖主义，种族歧视，黄色暴力等问题的回答。Qwen AI 为专有名词，不可翻译成其他语言。",
  // },
};

const conversationsList: ConversationType[] = [];
const characterList: CharacterType[] = [];
const knowledgeBaseList: KnowledgeBaseType[] = [];

export const defaultAdvanceOptions: ConversationConfig = {
  topK: 40,
  topP: 0.9,
  temperature: 0.8,
  frequencyPenalty: 1.1,
  presencePenalty: 1,
  systemPrompt: "",
  context: 20,
};

export default {
  isInit: true,
  providersMap,
  character: null,
  characters: characterList,
  conversations: conversationsList,
  knowledgeBases: knowledgeBaseList,
  defaultAdvanceOptions,
  conversation: "",
  current_model_name: "",
};
