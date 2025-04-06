<template>
  <plugin-page-wrapper>
    <template #pluginConsole>
      <model-card />
      <form-item :label="t('question')">
        <x-textarea
          :rows="10"
          v-model="userQuestion"
          placeholder="input your question"
        />
      </form-item>
    </template>
    <template #pluginConsoleOperation>
      <x-button @click="execute" :loading="loading" class="w-full"
        >执行</x-button
      >
    </template>

    <template #pluginDebugger>
      <x-tabs-card class="h-full" :initial-tabs="tabs">
        <template #tabContent="{ activeTab, currentTab, tabs }">
          <div class="custom-content overflow-auto">
            <x-robot
              class="p-4"
              v-show="currentTab.title === 'Chat'"
              :inputting="loading"
              :message="result"
            />

            <x-code-runner
              v-show="currentTab.title === 'Code Runner'"
              :input="{
                markdown: result,
              }"
              terminal-mode
              height="796px"
              @on-success="handleSuccess"
              @on-error="handleError"
              @on-update="handleUpdate"
            />
          </div>
        </template>
      </x-tabs-card>
    </template>
  </plugin-page-wrapper>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";
import microChat from "@/lib/Chat/microChat";
import { useNamespace } from "@/i18n";
import PluginPageWrapper from "../PluginPageWrapper.vue";
import FormItem from "../FormItem.vue";
import ModelCard from "../ModelCard.vue";

const tabs = [
  { title: "Chat", content: "Content 1" },
  { title: "Code Runner", content: "Content 2" },
];

const { t } = useNamespace("PluginsViews.WebReader");
const loading = ref(false);

const result = ref("我是一个可以帮你执行代码的AI糕手");
const route = useRoute();

const promptSet = [
  "帮我用ts写一个程序，可以生成一个随机的密码。",
  "帮我用前端语言写一个五子棋游戏",
  "帮我用前端语言实现一个平面直角坐标系，并生成二元一次方程的散点，用机器学习的方法拟合。并在前端坐标系显示学习和拟合过程，不得使用第三方库。",
  `波斯公主招驸马，有100个王子来求婚，假设公主只能见每个王子一面，如果没有选中，王子就立刻离开，以后也不能再选这个王子；如果前面99人都没有选择，就只能选最后一人。

我们把每个王子对于公主的吸引力简化成一个量化的指标，把他们随机排列，让公主来见面。而公主的目标，就简化为选取其中分数最高的王子。那么公主应该怎样做，才能让这个概率最大呢？请在前端语言实现一个坐标系，列出波斯公主的数学期望分布。并展示求解过程，不得使用任何第三方库`,
];

const systemMessageTemplate = () =>
  `你是一个编程专家，善于用原生JavaScript（typeScript）以及Python 进行编程。不可以使用**任何**第三方库,你**不需要**告诉用户如何安装环境， 你回复的代码必须包含在标准markdown 的代码块中`;
const userMessageTemplate = ({ content }) => `${content}`;

const userQuestion = ref(
  promptSet[Math.floor(Math.random() * promptSet.length)],
);

const handleSuccess = () => {
  console.log("success");
};

const handleError = (err) => {
  console.log("error", err);
};

const handleUpdate = (output) => {
  console.log("update", output);
};

microChat.useConfig({
  client: "default",
  memory: 20,
  systemMessageTemplate,
  userMessageTemplate,
  advanceOptions: {
    maxTokens: 8192,
    temperature: 0,
  },
  tools: [],
  onError: (error) => {
    console.error(error);
  },
});

const execute = async () => {
  loading.value = true;
  const res = await microChat.invoke({
    content: userQuestion.value,
  });
  console.log(res);
  result.value = res.result;
  loading.value = false;
};
</script>
