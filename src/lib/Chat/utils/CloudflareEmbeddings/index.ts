import { Embeddings, EmbeddingsParams } from "@langchain/core/embeddings";
import { chunkArray } from "@langchain/core/utils/chunk_array";
import request from "@/lib/request";
type AiTextEmbeddingsInput = {
  text: string | string[];
};

type AiTextEmbeddingsOutput = {
  shape: number[];
  data: number[][];
};

export interface CloudflareWorkersAIEmbeddingsParams extends EmbeddingsParams {
  /** Binding */
  // binding: Ai;

  /**
   * Model name to use
   * Alias for `model`
   */
  modelName?: string;
  /**
   * Model name to use
   */
  model?: string;

  /**
   * The maximum number of documents to embed in a single request.
   */
  batchSize?: number;

  /**
   * Whether to strip new lines from the input text. This is recommended by
   * OpenAI, but may not be suitable for all use cases.
   */
  stripNewLines?: boolean;

  baseUrl?: string;
}

export default class CloudflareWorkersAIEmbeddings extends Embeddings {
  modelName = "@cf/baai/bge-base-en-v1.5";

  model = "@cf/baai/bge-base-en-v1.5";

  batchSize = 50;

  stripNewLines = true;

  baseUrl: string;

  constructor(fields: CloudflareWorkersAIEmbeddingsParams) {
    super(fields);

    this.baseUrl = fields.baseUrl ?? "";

    // this.ai = fields.binding;
    this.modelName = fields?.model ?? fields.modelName ?? this.model;
    this.model = this.modelName;
    this.stripNewLines = fields.stripNewLines ?? this.stripNewLines;
  }

  async embedDocuments(texts: string[]): Promise<number[][]> {
    const batches = chunkArray(
      this.stripNewLines ? texts.map((t) => t.replace(/\n/g, " ")) : texts,
      this.batchSize,
    );

    const batchRequests = batches.map((batch) => this.runEmbedding(batch));
    const batchResponses = await Promise.all(batchRequests);
    const embeddings: number[][] = [];

    for (let i = 0; i < batchResponses.length; i += 1) {
      const batchResponse = batchResponses[i];
      for (let j = 0; j < batchResponse.length; j += 1) {
        embeddings.push(batchResponse[j]);
      }
    }

    return embeddings;
  }

  async embedQuery(text: string): Promise<number[]> {
    const data = await this.runEmbedding([
      this.stripNewLines ? text.replace(/\n/g, " ") : text,
    ]);
    return data[0];
  }

  private async runEmbedding(texts: string[]) {
    return this.caller.call(async () => {
      const response = await request({
        url: `${this.baseUrl}/run/${this.modelName}`,
        method: "POST",
        data: {
          text: texts,
        },
      });

      return response.data;
    });
  }
}
