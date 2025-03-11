<template>
  <x-subpage-wrapper
    :title="'对话高级设置'"
    :isFullWidth="props.isFullWidth"
    @onClose="props.onClose"
  >
    <template #content>
      <div class="flex h-full flex-col">
        <!-- <div class="px-0.5">
          <x-select :options="[{ id: 'aaa', name: 'bbb' }]" />
          <p class="mt-2 mb-4 text-sm text-gray-500">
            预设
            允许你自定义模型的性格并储存到本地，而你当前的更改只对当前对话生效。
          </p>
        </div> -->

        <div>
          <h3 class="mt-1.5 text-sm leading-8 text-gray-700">System Prompt</h3>
          <!-- v-model="conversationConfig.systemPrompt" -->
          <x-textarea
            v-model="conversationConfig.systemPrompt"
            :rows="10"
            placeholder="如果当前对话有使用角色卡，编辑系统提示词将覆盖当前角色卡的提示词"
          />
        </div>

        <!-- <div>
          <h3 class="mt-1.5 flex gap-1 text-sm leading-8 text-gray-700">
            <div>Max Message Count in Context</div>
            <x-tooltip
              position="right"
              class="flex items-center"
              text="上下文剪支"
              ><i-mdi-help-circle-outline
            /></x-tooltip>
          </h3>
          <x-slider />
        </div> -->

        <div>
          <h3 class="mt-1.5 flex gap-1 text-sm leading-8 text-gray-700">
            <div>Temperature</div>
            <x-tooltip
              position="right"
              class="flex items-center"
              text="模型的温度，提高温度将让模型更具创造性的回答"
              ><i-mdi-help-circle-outline
            /></x-tooltip>
          </h3>
          <x-slider
            v-model="conversationConfig.temperature"
            :min="0"
            :max="2"
            :step="0.01"
          />
        </div>

        <div>
          <h3 class="mt-1.5 flex gap-1 text-sm leading-8 text-gray-700">
            <div>Top K</div>
            <x-tooltip
              position="right"
              class="flex items-center"
              text="降低产生无意义答案的概率，数值越大，答案越多样化，数值越小，答案越保守"
              ><i-mdi-help-circle-outline
            /></x-tooltip>
          </h3>
          <x-slider
            v-model="conversationConfig.topK"
            :min="0"
            :max="100"
            :step="0.5"
          />
        </div>

        <div>
          <h3 class="mt-1.5 flex gap-1 text-sm leading-8 text-gray-700">
            <div>Top P</div>
            <x-tooltip
              position="right"
              class="flex items-center"
              text="和 Top K 一起工作，较高的值将导致更具多样性的文本，较低的值将生成更集中和保守的文本"
              ><i-mdi-help-circle-outline
            /></x-tooltip>
          </h3>
          <x-slider
            v-model="conversationConfig.topP"
            :min="0"
            :max="1"
            :step="0.01"
          />
        </div>

        <div>
          <h3 class="mt-1.5 flex gap-1 text-sm leading-8 text-gray-700">
            <div>Frequency Penalty</div>
            <x-tooltip
              position="right"
              class="flex items-center"
              text="频率惩罚（Frequency Penalty）是另一个可用于控制生成的输出中单词或短语重复的参数。通过设置更高的频率惩罚值，比如1.5，可以惩罚模型过度出现重复相同的单词或短语。这有助于产生更加多样化结果。"
              ><i-mdi-help-circle-outline
            /></x-tooltip>
          </h3>
          <x-slider
            v-model="conversationConfig.frequencyPenalty"
            :min="-2"
            :max="2"
            :step="0.01"
          />
        </div>

        <div>
          <h3 class="mt-1.5 flex gap-1 text-sm leading-8 text-gray-700">
            <div>Presence Penalty</div>
            <x-tooltip
              position="right"
              class="flex items-center"
              text="存在惩罚（Presence Penalty）用于阻止模型在生成的响应中提到某些单词或短语。通过分配更高的存在惩罚值(如2.0)，可以减少输出中出现特定单词或短语的可能性。"
              ><i-mdi-help-circle-outline
            /></x-tooltip>
          </h3>
          <x-slider
            v-model="conversationConfig.presencePenalty"
            :min="-2"
            :max="2"
            :step="0.01"
          />
        </div>
      </div>
    </template>
  </x-subpage-wrapper>
</template>
<script lang="ts" setup>
import { ref, watch } from "vue";
import { useChatStore, ConversationConfig } from "@/store/chat";
import _ from "lodash";

const chatStore = useChatStore();

// 表单本地状态就交给本地状态管理。但需要接受store配置的指导(重新打开时)
const conversationConfig = ref<ConversationConfig>(
  chatStore.conversationConfig,
);
console.log(chatStore.conversationConfig);
const { updateConversationAdvanceSetting } = chatStore.$service;

const debouncedWatchHandler = _.debounce(updateConversationAdvanceSetting, 300); // 300ms 防抖时间

// 每当主动修改都要去更新
watch(conversationConfig, debouncedWatchHandler, { deep: true });
// 每当chatStore.conversationConfig上下文更新，也要更新
// watch(
//   chatStore.conversationId,
//   (newValue) => {
//     console.log(111, newValue);
//     conversationConfig.value = chatStore.conversationConfig;
//   },
//   { deep: true },
// );

const props = defineProps<{
  isFullWidth?: boolean;
  onClose?: () => void;
}>();
</script>
<style scoped></style>
