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
      );
    default:
      throw new Error(`Unsupported vector store type: ${vectorStoreType}`);
  }
}
