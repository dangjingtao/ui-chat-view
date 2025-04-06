import { createMemoryVectorStore } from "./createMemoryVectorStore";
import { createCloseVectorWebStore } from "./createCloseVectorWebStore";

export type VectorStoreConfig =
  | { type: "memory" }
  | { type: "closeVector"; name: string };

// 获取向量储存
export async function createVectorStore(
  textData: string[],
  embeddings: any,
  vectorStoreConfig: VectorStoreConfig = {
    type: "memory",
  },
  options: {
    text: string;
    chunkSize: number;
    chunkOverlap: number;
    retrievalLimit: number;
  } = {
    text: "",
    chunkSize: 100,
    chunkOverlap: 1,
    retrievalLimit: 2,
  },
) {
  const { type: vectorStoreType } = vectorStoreConfig;
  switch (vectorStoreType) {
    case "memory":
      return await createMemoryVectorStore(textData, embeddings);
    case "closeVector":
      const { name: vectorStoreName } = vectorStoreConfig;
      return await createCloseVectorWebStore(
        textData,
        embeddings,
        vectorStoreName,
        options
      );
    default:
      throw new Error(`Unsupported vector store type: ${vectorStoreType}`);
  }
}
