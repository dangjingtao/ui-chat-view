import { WebBrowser } from "langchain/tools/webbrowser";
import { ChatOllama, OllamaEmbeddings } from "@langchain/ollama";

async function run() {
  const model = new ChatOllama({
    model: "deepseek-r1:14b",
    streaming: true,
    temperature: 0,
  });

  const embeddings = new OllamaEmbeddings({
    model: "nomic-embed-text:v1.5",
  });

  const browser = new WebBrowser({ model, embeddings });

  const result = await browser.invoke(
    `"https://techcrunch.com/2025/03/06/hugging-faces-chief-science-officer-worries-ai-is-becoming-yes-men-on-servers/","总结Wolf 的观点？"`,
  );

  console.log(result);
}

const webBrowserTool = (clientModel, embeddingModelName) => {
  const model = new ChatOllama({
    model: "deepseek-r1:14b",
    streaming: true,
    temperature: 0,
  });

  const embeddings = new OllamaEmbeddings({
    model: "nomic-embed-text:v1.5",
  });

  const browser = new WebBrowser({ model, embeddings });
};

export default webBrowserTool;
