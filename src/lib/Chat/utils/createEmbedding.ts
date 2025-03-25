import { OpenAIEmbeddings } from "@langchain/openai";
import { OllamaEmbeddings } from "@langchain/ollama";
import { CohereEmbeddings } from "@langchain/cohere";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { CohereClient } from "cohere-ai";

function createOllamaClient({ model, baseURL, apiKey }): OllamaEmbeddings {
  return new OllamaEmbeddings({
    model,
  });
}

function createCohereClient({ model, baseURL, apiKey }): CohereEmbeddings {
  return new CohereEmbeddings({
    model,
    client: new CohereClient({
      environment: baseURL,
      token: apiKey,
    }),
  });
}

function createDefaultClient(
  baseURL: string,
  apiKey: string,
): OpenAIEmbeddings {
  return new OpenAIEmbeddings({
    configuration: {
      baseURL: baseURL + "/v1",
    },
    apiKey,
  });
}

export default function createEmbeddingClient(
  provider: string,
  model: string,
  baseURL: string,
): any {
  const apiKey = localStorage.getItem("apiKey");
  const commonOptions = { model, baseURL, apiKey };

  switch (provider) {
    case "ollama":
      return createOllamaClient(commonOptions);
    case "cohere":
      return createCohereClient(commonOptions);
    default:
      return createDefaultClient(commonOptions);
  }
}
