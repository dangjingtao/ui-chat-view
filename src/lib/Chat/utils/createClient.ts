import { ChatOpenAI } from "@langchain/openai";
import { ChatOllama } from "@langchain/ollama";
import { ChatCohere } from "@langchain/cohere";
import { ChatDeepSeek } from "@langchain/deepseek";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatGroq } from "@langchain/groq";
import { CohereClient } from "cohere-ai";

function createOllamaClient(commonOptions: object): ChatOllama {
  return new ChatOllama({
    ...commonOptions,
    streaming: true,
  });
}

function createGroqClient(
  commonOptions: object,
  baseURL: string,
  apiKey: string,
): ChatGroq {
  return new ChatGroq({
    ...commonOptions,
    baseUrl: baseURL,
    apiKey,
  });
}

function createCohereClient(
  commonOptions: object,
  baseURL: string,
  apiKey: string,
): ChatCohere {
  return new ChatCohere({
    ...commonOptions,
    client: new CohereClient({
      environment: baseURL,
      token: apiKey,
    }),
  });
}

function createDeepSeekClient(
  commonOptions: object,
  baseURL: string,
  apiKey: string,
): ChatDeepSeek {
  return new ChatDeepSeek({
    ...commonOptions,
    configuration: {
      baseURL: baseURL,
    },
    apiKey,
  });
}

function createGeminiClient(
  commonOptions: object,
  baseUrl: string,
  apiKey: string,
): ChatGoogleGenerativeAI {
  // return new ChatGoogleGenerativeAI({
  //   ...commonOptions,
  //   baseUrl,
  //   apiKey,
  // });
  return new ChatOpenAI({
    model: commonOptions.model,
    configuration: {
      baseURL: baseUrl + "/v1beta/openai",
    },
    apiKey,
  });
}

function createDefaultClient(
  commonOptions,
  baseURL: string,
  apiKey: string,
): ChatOpenAI {
  return new ChatOpenAI({
    configuration: {
      baseURL: baseURL + "/v1",
    },
    model: commonOptions.model,
    apiKey,
  });
}

export default function createClient(
  provider: string,
  model: string,
  baseURL: string,
  advanceOptions: object,
): any {
  const apiKey = localStorage.getItem("apiKey");
  const commonOptions = { model, ...advanceOptions };

  switch (provider) {
    case "ollama":
      return createOllamaClient(commonOptions, baseURL, apiKey);
    case "groq":
      return createGroqClient(commonOptions, baseURL, apiKey);
    case "cohere":
      return createCohereClient(commonOptions, baseURL, apiKey);
    case "deepseek":
      return createDeepSeekClient(commonOptions, baseURL, apiKey);
    case "gemini":
      return createGeminiClient(commonOptions, baseURL, apiKey);
    default:
      return createDefaultClient(commonOptions, baseURL, apiKey);
  }
}
