import KnowledgeBaseModule from "./modules/KnowledgeBase";
import Character from "./modules/Character";
import Conversation from "./modules/Conversation";
import ModelProvider from "./modules/ModelProvider";

export type ModelController = KnowledgeBaseModule &
  Character &
  Conversation &
  ModelProvider;

// 服务商名称
export type ProviderName =
  | "kimi"
  | "qwen"
  | "deepseek"
  | "groq"
  | "ollama"
  | "openAI";

type Models = {
  chatConfig: any;
  chatHistory: any[];
};

interface ChatConfig {
  baseURL: string;
  apiKey: string;
  provider: ProviderName;
  systemPrompt: string;
  models: Models[];
}

type ConfigMap = {
  [key in ProviderName]: ChatConfig;
};

// 对话列表
export type ConversationType = {
  id: string;
  provider: string;
  model: string;
  chatHistory: any[];
};

// 角色列表
export type CharacterType = {
  name: string;
  chatClass: string;
  type: ProviderName;
  avatar: string;
  description: string;
  chatConfig: ChatConfig;
};

// 聊天消息类型
export type ChatMessageType = {
  id?: string;
  content: string;
  role: string;
  timestamp?: Date;
  stream?: any;
  directive?: any;
};

export type KnowledgeBaseType = {
  id: string;
  knowledgeBaseName: string;
  knowledgeBaseDescription: string;
  createTime: number;
  updateTime: number;
};

// 定义 ChatContext 类型
export type ChatContext = {
  model: string;
  provider: string;
  conversation: any;
  URLs: {
    models: string;
  };
  systemPrompt: string;
  id?: string; // 会话id
  charactor?: any;
};
