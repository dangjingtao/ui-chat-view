import { createRetrievalChain } from "langchain/chains/retrieval";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { BaseRetriever } from "@langchain/core/retrievers";

// @ts-ignore
class ScoreAwareRetriever extends BaseRetriever {
  private vectorStore: any; // Declare the vectorStore property
  private k: number; // Declare the k property

  constructor(vectorStore: any, k: number) {
    super();
    this.vectorStore = vectorStore;
    this.k = k;
  }

  async _getRelevantDocuments(query) {
    const docsWithScores = await this.vectorStore.similaritySearchWithScore(
      query,
      this.k,
    );
    // 劫持余弦相似度
    const docs = docsWithScores.map(([doc, score]) => {
      doc.metadata = { ...doc.metadata, similarityScore: score };
      return doc;
    });
    return docs;
  }
}

export async function setupRAG({
  client,
  vectorStore,
  promptTemplate,
  retrievalOptions = { limit: 2 },
}) {
  // 使用自定义检索器
  const retriever = new ScoreAwareRetriever(
    vectorStore,
    retrievalOptions.limit,
  );

  const chain = await createRetrievalChain({
    retriever,
    combineDocsChain: await createStuffDocumentsChain({
      llm: client,
      prompt: promptTemplate,
    }),
  });

  return chain;
}
