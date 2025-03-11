export type OllamaChatRequestParams = {
  topK?: number; // 0~100 step 0.5
  topP?: number; // 0~1 /0.01
  temperature?: number; // 0~2
  frequencyPenalty?: number; // 频率惩罚 Frequency Penalty -2~2
  presencePenalty?: number; // 存在惩罚 -2~2

  // repeatPenalty?: number; //重复惩罚
  // numPredict?: number; //此选项设置了模型在回答中可以生成的最大 Token 数。增加这个限制可以让模型提供更长的答案，但也可能增加生成无用或不相关内容的可能性。 (默认值：128）
  // seed?: number; // any number
};
