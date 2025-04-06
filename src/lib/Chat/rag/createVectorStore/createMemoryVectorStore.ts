import { MemoryVectorStore } from "langchain/vectorstores/memory";

export async function createMemoryVectorStore(
  textData: string[],
  embeddings: any,
) {
  console.log("Using MemoryVectorStore...");
  return await MemoryVectorStore.fromTexts(
    textData,
    textData.map((_, i) => ({ id: i })),
    embeddings,
  );
}
