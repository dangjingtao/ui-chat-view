import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
} from "@langchain/core/prompts";
import { createVectorStore, VectorStoreConfig } from "./createVectorStore";
import { setupRAG } from "./setupRag";
// import testText from "./test.md?raw";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import type { ChatClient, ChatEmbeddings } from "../types";

// 主函数：useRAG
export const useRAG = async ({
  text,
  client,
  embeddings,
  chunkSize = 100,
  chunkOverlap = 1,
  messages = [],
  vectorStoreConfig = { type: "memory" },
  retrievalLimit = 2,
  onChunkSuccess = () => {},
}: {
  text: string;
  client: ChatClient;
  embeddings: ChatEmbeddings;
  chunkSize?: number;
  chunkOverlap?: number;
  messages?: (AIMessage | HumanMessage)[];
  vectorStoreConfig: VectorStoreConfig;
  retrievalLimit?: number;
  onChunkSuccess?: (chunks: string[]) => void;
}): Promise<any> => {
  try {
    // 分割文本
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize,
      chunkOverlap,
    });
    const chunks = await splitter.createDocuments([text]);
    const textData =
      chunks.length > 0 ? chunks.map((x) => x.pageContent) : [text];
    onChunkSuccess(textData);

    const vectorStore = await createVectorStore(
      textData,
      embeddings,
      vectorStoreConfig,
      { text, chunkSize, chunkOverlap, retrievalLimit },
    );

    // 创建提示模板
    const history = [
      SystemMessagePromptTemplate.fromTemplate(
        `Use the following pieces of context to answer the question at the end.
        ---
        {context}
        ---
        If you don't know the answer, just say that you don't know, don't try to make up an answer.`,
      ),
      ...messages,
    ];
    const promptTemplate = ChatPromptTemplate.fromMessages(history);

    // 设置 RAG 链
    const chain = await setupRAG({
      client,
      vectorStore,
      promptTemplate,
      retrievalOptions: { limit: retrievalLimit },
    });

    const input = messages[messages.length - 1]?.content[0].text;

    // // //! 调试 执行查询
    const data = await chain.invoke({
      input,
    });
    console.log(data);
    const { answer, context = [] } = data;

    return { answer, refers: context };
  } catch (error) {
    console.error("Error in useRAG:", error);
    throw new Error("RAG 处理失败");
  }
};
