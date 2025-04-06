<template>
  <plugin-page-wrapper>
    <template #pluginConsole>
      <model-card type="embedding" />
      <form-item
        :label="'数据库选择'"
        :tooltip="'UI Chat改造了langchain中极为难用的Close Vector集成，让它支持浏览器端储存。如果你选择内存，每次都会重新调用向量化，相当费token，'"
      >
        <x-model-select
          v-model="formModel.db"
          :options="[
            { id: 'memory', name: '内存' },
            { id: 'closeVector', name: `Close Vector （${TestVectorDB}）` },
          ]"
          class="w-full min-w-full"
        />
      </form-item>

      <div class="flex gap-2">
        <form-item class="w-full" :label="'分块'">
          <x-input
            v-model="formModel.chunkSize"
            class="w-full"
            type="number"
            placeholder="tokens"
            :min="1"
            :max="100"
          />
        </form-item>

        <form-item class="w-full" :label="'分块重叠'">
          <x-input
            v-model="formModel.chunkOverlap"
            class="w-full"
            type="number"
            placeholder="tokens"
            :min="1"
            :max="100"
          />
        </form-item>
      </div>

      <div class="flex gap-2">
        <form-item
          class="w-full"
          v-model="formModel.splitSignal"
          :label="'分块标识符'"
          :tooltip="'分隔符是用于分隔文本的字符。\n\n和 \n 是常用于分隔段落和行的分隔符。用逗号连接分隔符(\nn,\n)，当段落超过最大块长度时，会按行进行分割。你也可以使用自定义的特殊分隔符(例如 ***)'"
        >
          <x-input class="w-full" placeholder="tokens" />
        </form-item>
        <form-item
          class="w-full"
          :label="'引用计数'"
          :tooltip="'大模型回答时最大的引用数量'"
        >
          <x-input
            type="number"
            v-model="formModel.retrievalLimit"
            class="w-full"
            placeholder="tokens"
          />
        </form-item>
      </div>

      <form-item :label="'加载知识库'">
        <div class="flex w-full gap-2">
          <x-button type="base" class="relative w-full"
            ><x-upload
              accept=".md,.txt"
              @failed="onUploadFailed"
              @upload="onUpload"
            ></x-upload>
            <div class="absolute top-1.5 w-full text-center">
              {{ uploadInfo.fileName || "上传文档并向量化" }}
            </div>
          </x-button>
          <div class="w-[40px]">
            <x-button
              type="base"
              :disabled="!formModel.text && !uploadInfo.textData.length"
              @click="openDoc"
              class="w-full"
              ><i-mdi-eye
            /></x-button>
          </div>
        </div>
        <template #extra>
          <x-message :type="uploadInfo.type">{{ uploadInfo.info }}</x-message>
        </template>
      </form-item>

      <form-item label="查询" class="mt-3">
        <x-textarea
          :rows="5"
          v-model="userQuestion"
          placeholder="input your question"
        />
      </form-item>
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
          <x-robot :inputting="loading" :refers="refers" :message="result" />
        </div>
      </div>
    </template>
  </plugin-page-wrapper>

  <x-popup ref="popup"
    ><div class="p-2 pt-12 md:p-12">
      <x-tab :tabs="['原始文本', '分块文本']">
        <template #tab-0>{{ formModel.text }}</template>
        <template #tab-1>
          <div class="flex flex-col gap-2">
            <div
              class="rounded-sm border border-gray-300 p-2"
              v-for="chunk in uploadInfo.textData"
            >
              {{ chunk }}
            </div>
          </div>
        </template>
      </x-tab>
    </div>
  </x-popup>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import microChat from "@/lib/Chat/microChat";
import { useNamespace } from "@/i18n";
import PluginPageWrapper from "../PluginPageWrapper.vue";
import FormItem from "../FormItem.vue";
import ModelCard from "../ModelCard.vue";
import { markdownTextLoader } from "@/lib/fileLoader";

const { t } = useNamespace("PluginsViews.Rag");
const loading = ref(false);
const popup = ref(null);
const TestVectorDB = "TestVectorDB";

const openDoc = () => {
  if (popup.value) {
    popup.value.open();
  }
};

const formModel = ref({
  db: "memory",
  chunkSize: 50,
  chunkOverlap: 1,
  retrievalLimit: 4,
  text: "",
  splitSignal: "",
});

// const plugin = plugins.find((plugin) => plugin.id === route.params.id);
const result = ref(
  "我是深谙民情的砖家，我特长是向群众 建议 。所以当上了人大代表",
);
const route = useRoute();

const uploadInfo = ref({
  type: "warning",
  info: "当前没上传知识库文档",
  fileName: "",
  textData: [],
});

const onUpload = async ({ fileBase64, document }) => {
  const text = await markdownTextLoader(fileBase64);
  uploadInfo.value = {
    ...uploadInfo.value,
    type: "info",
    info: "上传成功",
    fileName: document.name,
  };
  formModel.value = {
    ...formModel.value,
    text,
  };
};

const onUploadFailed = async (e) => {
  if (e) {
    uploadInfo.value = {
      ...uploadInfo.value,
      type: "danger",
      info: e,
    };
  }
};

const userMessageTemplate = ({ content }) => `${content}`;

const userQuestion = ref("莫洛托夫鸡尾酒是啥?");

const refers = ref([]);
const execute = async () => {
  loading.value = true;

  const vectorStoreConfig = {
    type: formModel.value.db,
    name: formModel.value.db === "memory" ? undefined : TestVectorDB,
  };
  await microChat.useConfig({
    client: "default",
    memory: 20,
    userMessageTemplate,
    advanceOptions: {
      maxTokens: 8192,
      temperature: 0,
    },
    rag: {
      chunkSize: formModel.value.chunkSize,
      chunkOverlap: formModel.value.chunkOverlap,
      vectorStoreConfig,
      retrievalLimit: formModel.value.retrievalLimit,
      onChunkSuccess: (textData) => {
        uploadInfo.value = {
          ...uploadInfo.value,
          type: "success",
          info: "分块成功",
          textData,
        };
      },
      text: formModel.value.text,
    },
  });

  const { result: answer, refers: docRefers } = await microChat.invoke({
    content: userQuestion.value,
  });

  if (docRefers.length > 0) {
    refers.value = docRefers;
  }

  result.value = answer;
  loading.value = false;
};
</script>
