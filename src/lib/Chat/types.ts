import { ChatOpenAI } from "@langchain/openai";
import { ChatOllama } from "@langchain/ollama";
import { ChatGroq } from "@langchain/groq";

export type ProviderName =
  | "kimi"
  | "qwen"
  | "deepseek"
  | "groq"
  | "ollama"
  | "openai"
  | "";
export type Provider = ChatOpenAI | ChatOllama | ChatGroq;
export interface ChatConfig {
  provider: ProviderName;
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
}
export type ChatClient = ChatOpenAI | ChatOllama | ChatGroq | null;
