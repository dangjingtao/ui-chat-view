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
  | "openAI"
  | "cohere"
  | "gemini"
  | "cloudflare";

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

export type AdvanceOptions = {
  topK?: number; // 0~100 step 0.5
  topP?: number; // 0~1 /0.01
  temperature?: number; // 0~2
  frequencyPenalty?: number; // 频率惩罚 Frequency Penalty -2~2
  presencePenalty?: number; // 存在惩罚 -2~2
  systemPrompt?: string;
  maxTokens?: number;

  // repeatPenalty?: number; //重复惩罚
  // numPredict?: number; //此选项设置了模型在回答中可以生成的最大 Token 数。增加这个限制可以让模型提供更长的答案，但也可能增加生成无用或不相关内容的可能性。 (默认值：128）
  // seed?: number; // any number
};

// 对话列表
export type ConversationType = {
  id: string;
  provider: string;
  model: string;
  chatHistory: any[];
  advanceOptions: AdvanceOptions;
  createTime: number;
  updateTime: number;
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
  systemPrompt: string;
  id?: string; // 会话id
  character?: any;
};
