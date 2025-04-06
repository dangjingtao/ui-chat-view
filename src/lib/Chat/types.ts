import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { ChatOllama, OllamaEmbeddings } from "@langchain/ollama";
import { ChatGroq } from "@langchain/groq";
import CloudflareWorkersAIEmbeddings from "@/lib/Chat/utils/CloudflareEmbeddings";

export type ProviderName =
  | "kimi"
  | "qwen"
  | "deepseek"
  | "groq"
  | "ollama"
  | "openai"
  | ""
  | "cloudflare";
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

export type ChatEmbeddings =
  | OpenAIEmbeddings
  | OllamaEmbeddings
  | CloudflareWorkersAIEmbeddings
  | null;
