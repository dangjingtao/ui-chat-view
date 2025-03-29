<template>
  <plugin-page-wrapper>
    <template #pluginConsole>
      <div class="mb-3">
        <div class="flex gap-2">
          <x-input class="flex-1" v-model="url" :disabled="true" />
          <x-button @click="checkState" type="base" size="small"
            ><i-mdi-connection
          /></x-button>
        </div>
      </div>
      <x-list class="h-137" title="MCP 集成" :items="[]" />
    </template>
    <template #pluginConsoleOperation>
      <x-button class="w-full" type="primarily" @click="() => (visible = true)"
        >添加MCP服务器</x-button
      >
    </template>

    <template #pluginDebugger>
      <x-textarea
        v-model="prompt"
        placeholder="需要我帮什么忙？(ctrl + enter发送)"
        @keydown.enter="handleKeyDown"
        :rows="5"
        class="rounded-2xl"
      />
      <x-robot class="mt-10" :inputting="typing" :message="result" />
    </template>
  </plugin-page-wrapper>

  <x-dialog :visible="visible" @confirm="addMCP" @cancel="clearFormValue">
    <template #header>添加MCP服务器</template>
    <template #body>
      <x-input
        v-model="formValue.name"
        class="mb-4 w-full"
        placeholder="名称"
      />
      <x-input
        v-model="formValue.command"
        class="mb-4 w-full"
        :disabled="true"
        placeholder="命令"
      />
      <x-textarea
        v-model="formValue.description"
        class="mb-3"
        :rows="5"
        placeholder="描述"
      />
      <x-textarea v-model="formValue.args" :rows="5" placeholder="参数" />
    </template>
  </x-dialog>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import microChat from "@/lib/Chat/microChat";
import { useNamespace } from "@/i18n";
import { plugins } from "../../data/plugins";
import PluginPageWrapper from "../PluginPageWrapper.vue";
import request from "@/lib/request";
import cachePlugin from "@/plugins/cachePlugin";
import _ from "lodash";
const { t } = useNamespace("PluginsViews.MCPRunner");
const route = useRoute();

const visible = ref(false);
const defaultFormValue = {
  name: "",
  command: "npx",
  description: "",
  args: "",
};

const formValue = ref(_.cloneDeep(defaultFormValue));

const url = ref("http://127.0.0.1:8462");

const prompt = ref("打开url https://www.landchina.com/#/resultNotice");
const webLoading = ref(false);

const clearFormValue = async () => {
  formValue.value = _.cloneDeep(defaultFormValue);
  visible.value = false;
};

const addMCP = async () => {
  // console.log(formValue.value);

  clearFormValue();
};

const checkState = async () => {
  const res = await request({
    url: `${url.value}`,
    method: "GET",
  });
  console.log(res);
};

microChat.usePlugin({
  pluginId: route.params.id,
  client: "default",
  memory: 20,
  systemMessageTemplate: (p) =>
    `你是一个会调用工具的智能助手，请使用提供的工具帮用户解决问题。`,
  userMessageTemplate: ({ content }) =>
    `用 MCPTestTool 帮我执行（或搜索） ${content} `,
  advanceOptions: {
    maxTokens: 8192,
    temperature: 0,
  },
  tools: [
    {
      name: "MCPTestTool",
      version: "1.0.0",
      props: {
        onCreated: () => {
          webLoading.value = true;
        },
        onSuccess: (data) => {
          console.log("web browser success", data);
          const { context } = data;
          webLoading.value = false;
        },
        onFailed: (error) => {
          console.error("web browser failed", error);
          webLoading.value = false;
        },
      },
    },
  ],
  onError: (error) => {
    console.error(error);
  },
});

const result = ref("你要来一发吗？");
const typing = ref(false);
const onSend = async (prompt: string) => {
  console.log("onSend", prompt);
  typing.value = true;
  const res = await microChat.invoke({
    content: prompt,
  });
  typing.value = false;
  result.value = res.result;
  console.log(res);
};

const handleKeyDown = async (event: KeyboardEvent) => {
  if (
    (event.ctrlKey && event.key === "Enter") ||
    (event.metaKey && event.key === "Enter")
  ) {
    onSend(prompt.value);
    prompt.value = "";
  }
};
</script>

<style>
/* 你可以在这里添加自定义样式 */
</style>
