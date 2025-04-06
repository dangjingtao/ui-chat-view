import { CloseVectorWeb } from "@langchain/community/vectorstores/closevector/web";
import cachePlugin from "@/plugins/cachePlugin";

// 加载缓存
async function loadFromCache(vectorStoreName: string) {
  const cachedData = await cachePlugin.getVectorDataBaseByName(vectorStoreName);
  if (cachedData) {
    console.log("Loading from cache...");
  }
  return cachedData;
}

// 从缓存重建 CloseVectorWeb
async function loadCloseVectorWebFromCache(cachedData: any, embeddings: any) {
  const space = "cosine";
  const vectorStore = new CloseVectorWeb(embeddings, { space });
  await vectorStore.addVectors(
    cachedData.embeddings,
    cachedData.texts.map((text: string, i: number) => ({
      pageContent: text,
      metadata: cachedData.metadata[i],
    })),
  );
  return vectorStore;
}

// 初始化新的 CloseVectorWeb
async function initializeCloseVectorWeb(textData: string[], embeddings: any) {
  console.log("Creating new vector store...");
  return await CloseVectorWeb.fromTexts(
    textData,
    textData.map((_, i) => ({ id: i })),
    embeddings,
  );
}

// 保存到缓存
async function saveToCache(
  vectorStore: CloseVectorWeb,
  textData: string[],
  embeddings: any,
  vectorStoreName: string,
  options: any = {
    text: "",
    chunkSize: 100,
    chunkOverlap: 1,
    retrievalLimit: 2,
  },
) {
  const vectors = await embeddings.embedDocuments(textData);
  const dataToSave = {
    name: vectorStoreName,
    options,
    texts: textData,
    metadata: textData.map((_, i) => ({ id: i })),
    embeddings: vectors,
  };
  await cachePlugin.addVectorDataBase(dataToSave);
  console.log("Saved to cache.");
}

// 创建 CloseVectorWeb 存储
export async function createCloseVectorWebStore(
  textData: string[],
  embeddings: any,
  vectorStoreName: string,
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
  const cachedData = await loadFromCache(vectorStoreName);

  if (cachedData) {
    return await loadCloseVectorWebFromCache(cachedData, embeddings);
  }

  const vectorStore = await initializeCloseVectorWeb(textData, embeddings);
  await saveToCache(
    vectorStore,
    textData,
    embeddings,
    vectorStoreName,
    options,
  );
  return vectorStore;
}
