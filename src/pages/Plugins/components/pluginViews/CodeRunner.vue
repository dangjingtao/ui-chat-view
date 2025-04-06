<template>
  <plugin-page-wrapper>
    <template #pluginConsole>
      <div>
        <h3 class="mt-1.5 flex gap-1 text-sm leading-8 text-gray-700">
          <div class="mb-1">{{ t("question") }}</div>
        </h3>
        <x-textarea
          :rows="10"
          v-model="userQuestion"
          placeholder="input your question"
        />
      </div>
    </template>
    <template #pluginConsoleOperation>
      <x-button @click="execute" :loading="loading" class="w-full"
        >执行</x-button
      >
    </template>

    <template #pluginDebugger>
      <div
        class="mb-2 flex h-full flex-col overflow-auto rounded-md border border-gray-300"
      >
        <div></div>

        <div class="p-4">
          <x-robot :inputting="loading" :message="result" />
        </div>
      </div>
      <x-code-runner
        :input="{
          markdown: result,
        }"
        terminal-mode
        height="500px"
        @on-success="handleSuccess"
        @on-error="handleError"
        @on-update="handleUpdate"
      />
    </template>
  </plugin-page-wrapper>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";
import microChat from "@/lib/Chat/microChat";
import { useNamespace } from "@/i18n";
import PluginPageWrapper from "../PluginPageWrapper.vue";

const { t } = useNamespace("PluginsViews.WebReader");
const loading = ref(false);

const result = ref("我是一个可以帮你执行代码的AI糕手");
const route = useRoute();

const systemMessageTemplate = () =>
  `你是一个编程专家，善于用原生JavaScript（typeScript）以及Python 进行编程。不可以使用其它库,你**不需要**告诉用户如何安装环境， 你回复的代码必须包含在标准markdown 的代码块中`;
const userMessageTemplate = ({ url, content }) => `${content}`;

// const userQuestion = ref("帮我用python写一个程序，可以生成一个随机的密码。");
// const userQuestion = ref("帮我用前端语言写一个计算器");

const userQuestion = ref("帮我用ts写一个程序，可以生成一个随机的密码。");

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
  pluginId: route.params.id,
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
