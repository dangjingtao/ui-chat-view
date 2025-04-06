<template>
  <div class="w-full rounded-md border border-gray-200 bg-white px-4 py-2">
    <div class="w-full text-sm leading-8 text-gray-500">
      LLM 模型: {{ modelInfo.llmTaskModel }}
    </div>
    <div class="w-full text-sm leading-8 text-gray-500">
      向量 模型: {{ modelInfo.embeddingTaskModel }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import cachePlugin from "@/plugins/cachePlugin";

const modelInfo = ref({
  llmTaskModel: "--",
  embeddingTaskModel: "--",
});

const init = async () => {
  const llmTaskModel = await cachePlugin.getTaskLLMModel();
  const embeddingTaskModel = await cachePlugin.getTaskEmbedModel();
  modelInfo.value = {
    llmTaskModel,
    embeddingTaskModel,
  };
};

init();
</script>
