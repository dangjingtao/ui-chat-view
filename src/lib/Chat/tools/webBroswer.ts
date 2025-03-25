import { WebBrowser } from "langchain/tools/webbrowser";
import { OllamaEmbeddings } from "@langchain/ollama";

const webBrowserTool = (clientModel, embeddingModelName) => {
  const embeddings = new OllamaEmbeddings({
    model: "nomic-embed-text:v1.5",
  });

  return new WebBrowser({ model: clientModel, embeddings });
};

export default webBrowserTool;
