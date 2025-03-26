<template>
  <plugin-page-wrapper>
    <template #pluginConsole>
      <div>
        <h3 class="mt-1.5 flex gap-1 text-sm leading-8 text-gray-700">
          <div class="mb-1">{{ t("url") }}</div>
        </h3>
        <x-input v-model="url" placeholder="input URL" />
      </div>

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
      <x-button :disabled="loading" @click="execute" class="w-full"
        >执行</x-button
      >
    </template>

    <template #pluginDebugger>
      <div
        class="flex h-full flex-col overflow-auto rounded-md border border-gray-300 p-6"
      >
        <div class="py-2">
          <x-robot :inputting="loading" :message="result" />
        </div>
        <!-- 模拟浏览器 -->
        <main class="mt-2 flex flex-1 flex-col overflow-auto">
          <x-input
            :disabled="true"
            type="text"
            :placeholder="url"
            class="mb-1 border-gray-300"
          />
          <div class="mt-1 w-full flex-1 overflow-y-auto p-2">
            <x-markdown :content="webBrowserContent" />
            <x-spin v-if="webLoading" class="pt-50" />
          </div>
        </main>
      </div>
    </template>
  </plugin-page-wrapper>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import microChat from "@/lib/Chat/microChat";
import { useNamespace } from "@/i18n";
import PluginPageWrapper from "../PluginPageWrapper.vue";
import { PROXY_WEBSITE_URL } from "@/config";

const { t } = useNamespace("PluginsViews.WebReader");
const loading = ref(false);

// const plugin = plugins.find((plugin) => plugin.id === route.params.id);
const result = ref("我们来湿湿把");
const route = useRoute();

const systemMessageTemplate = ({ url }) =>
  `根据给定的url, 请阅读并总结文本内容，并只允许根据你读取的网页内容进行回答。Url地址:${url}`;
const userMessageTemplate = ({ url, content }) =>
  `Based on the content you read using the web-browser tool at the web address [${url}], please answer the following question: ${content}.`;
// `根据你在网页地址${url}读取到的内容，回答我这个问题：${content}。请注意，你只能根据你读取到的内容进行回答，不能添加任何额外的信息。如果你无法回答这个问题，请告诉我你无法回答。 (${url})`;

const userQuestion = ref("中国黑客具体是做了什么事，请详细分析");
const url = ref(
  "https://thehackernews.com/2025/03/chinese-hackers-breach-asian-telecom.html",
);

function stringToBase64(str: string): string {
  return btoa(unescape(encodeURIComponent(`${str}`)));
}
const webLoading = ref(false);
const loader = async () => {
  const res = await microChat.invoke({
    url: `${PROXY_WEBSITE_URL}?${stringToBase64(url.value)}`,
    content: userQuestion.value,
  });

  result.value = res.result;
};
const webBrowserContent = ref("");

const execute = async () => {
  loading.value = true;
  webBrowserContent.value = "";
  await loader();
  loading.value = false;
};

microChat.usePlugin({
  pluginId: route.params.id,
  client: "default",
  memory: 20,
  systemMessageTemplate,
  userMessageTemplate,
  advanceOptions: {
    maxTokens: 8192,
    temperature: 0,
  },
  tools: [
    {
      name: "WebBrowser",
      version: "1.0.0",
      props: {
        onCreated: () => {
          webLoading.value = true;
        },
        onSuccess: (data) => {
          console.log("web browser success", data);
          const { context } = data;
          webBrowserContent.value = context;
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

watch(
  () => url,
  (newVal) => {
    microChat.usePlugin({
      pluginId: route.params.id,
      client: "default",
      memory: 20,
      systemMessageTemplate,
      userMessageTemplate,
      advanceOptions: {
        maxTokens: 4096,
        temperature: 0,
      },
      onError: (error) => {
        console.error(error);
      },
    });
  },
);
</script>
