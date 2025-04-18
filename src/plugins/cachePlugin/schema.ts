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
  openrouter: {
    provider: "openrouter",
    baseURL: `${BASE_URL}openrouter`,
  },
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
