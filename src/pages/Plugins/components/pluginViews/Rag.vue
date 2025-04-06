<template>
  <!-- 插件页面的包装组件 -->
  <plugin-page-wrapper>
    <!-- 插件控制台部分 -->
    <template #pluginConsole>
      <!-- 模型卡片 -->
      <model-card :type="t('embedding')" />

      <!-- 数据库选择 -->
      <form-item
        :label="t('databaseSelection')"
        :tooltip="t('databaseTooltip')"
      >
        <x-model-select
          v-model="formModel.db"
          :options="databaseOptions"
          class="w-full min-w-full"
          @change="handleChangeDB"
        />
      </form-item>

      <!-- 分块配置 -->
      <div class="flex gap-2">
        <form-item class="w-full" :label="t('chunk')">
          <x-input
            :disabled="isUseDB"
            v-model="formModel.chunkSize"
            class="w-full"
            type="number"
            :placeholder="t('tokens')"
            :min="1"
            :max="100"
          />
        </form-item>

        <form-item class="w-full" :label="t('chunkOverlap')">
          <x-input
            :disabled="isUseDB"
            v-model="formModel.chunkOverlap"
            class="w-full"
            type="number"
            :placeholder="t('tokens')"
            :min="1"
            :max="100"
          />
        </form-item>
      </div>

      <!-- 其他配置 -->
      <div class="flex gap-2">
        <form-item
          class="w-full"
          :label="t('chunkIdentifier')"
          :tooltip="t('chunkIdentifierTooltip')"
        >
          <x-input
            :disabled="isUseDB"
            class="w-full"
            v-model="formModel.splitSignal"
            :placeholder="t('tokens')"
          />
        </form-item>
        <form-item
          class="w-full"
          :label="t('retrievalLimit')"
          :tooltip="t('retrievalLimitTooltip')"
        >
          <x-input
            type="number"
            v-model="formModel.retrievalLimit"
            class="w-full"
            :disabled="isUseDB"
            :placeholder="t('tokens')"
          />
        </form-item>
      </div>

      <!-- 知识库加载 -->
      <form-item :label="t('loadKnowledgeBase')">
        <div class="flex w-full gap-2">
          <!-- 上传按钮 -->
          <x-button :disabled="isUseDB" type="base" class="relative w-full">
            <x-upload
              v-if="!isUseDB"
              accept=".md,.txt"
              @failed="onUploadFailed"
              @upload="onUpload"
            ></x-upload>
            <div class="absolute top-1.5 w-full text-center">
              {{ uploadInfo.fileName || t("uploadAndVectorize") }}
            </div>
          </x-button>
          <!-- 查看文档按钮 -->
          <div class="w-[40px]">
            <x-button
              type="base"
              :disabled="!formModel.text && !uploadInfo.textData.length"
              @click="openDoc"
              class="w-full"
            >
              <i-mdi-eye />
            </x-button>
          </div>
          <!-- 清理当前db按钮 -->
          <div v-if="isUseDB" class="w-[40px]">
            <x-button
              type="danger"
              :disabled="!isUseDB"
              @click="clearDB"
              class="w-full"
            >
              <i-mdi-trash-can />
            </x-button>
          </div>
        </div>
        <template #extra>
          <x-message :type="uploadInfo.type">{{ uploadInfo.info }}</x-message>
        </template>
      </form-item>

      <!-- 用户问题输入 -->
      <form-item :label="t('query')" class="mt-3">
        <x-textarea
          :rows="5"
          v-model="userQuestion"
          :placeholder="t('inputYourQuestion')"
        />
      </form-item>
    </template>

    <!-- 插件控制台操作 -->
    <template #pluginConsoleOperation>
      <x-button
        :loading="loading"
        :disabled="
          loading || (uploadInfo.textData.length == 0 && formModel.text === '')
        "
        @click="execute"
        class="w-full"
      >
        {{ t("execute") }}
      </x-button>
    </template>

    <!-- 插件调试器 -->
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

  <!-- 弹窗组件 -->
  <x-popup ref="popup">
    <div class="p-2 pt-12 md:p-12">
      <x-tab :tabs="[t('originalText'), t('chunkedText')]">
        <!-- 原始文本 -->
        <template #tab-0>{{ formModel.text }}</template>
        <!-- 分块文本 -->
        <template #tab-1>
          <div class="flex flex-col gap-2">
            <div
              class="rounded-sm border border-gray-300 p-2"
              v-for="chunk in uploadInfo.textData"
              :key="chunk"
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
import { ref } from "vue";
import microChat from "@/lib/Chat/microChat";
import { useNamespace } from "@/i18n";
import PluginPageWrapper from "../PluginPageWrapper.vue";
import FormItem from "../FormItem.vue";
import ModelCard from "../ModelCard.vue";
import { markdownTextLoader } from "@/lib/fileLoader";
import cachePlugin from "@/plugins/cachePlugin";
import _ from "lodash";
import dialog from "@/lib/dialog";
import message from "@/lib/message";

// 国际化函数
const { t } = useNamespace("PluginsViews.Rag");

const TEST_DB = "TestVectorDB";

const defaultFormModel = {
  db: "memory",
  chunkSize: 50,
  chunkOverlap: 1,
  retrievalLimit: 4,
  text: "",
  splitSignal: "",
};

// 加载状态
const loading = ref(false);

// 弹窗引用
const popup = ref(null);

// 数据库选项
const databaseOptions = [
  { id: "memory", name: t("memory") },
  { id: "closeVector", name: `${t("closeVector")}（${TEST_DB}）` },
];
// 是否使用持久化数据库
const isUseDB = ref(false);

// 表单模型
const formModel = ref(_.cloneDeep(defaultFormModel));

const defaultUploadInfo = {
  type: "warning",
  info: t("noKnowledgeBaseUploaded"),
  fileName: "",
  textData: [],
};

// 上传信息
const uploadInfo = ref(_.cloneDeep(defaultUploadInfo));

const handleChangeDB = async (value) => {
  if (value === "closeVector") {
    const data = await cachePlugin.getVectorDataBaseByName(TEST_DB);
    isUseDB.value = !!data;
    if (data) {
      const { options, texts } = data;
      formModel.value = {
        ...formModel.value,
        chunkSize: options.chunkSize,
        chunkOverlap: options.chunkOverlap,
        retrievalLimit: options.retrievalLimit,
        text: options.text,
        splitSignal: options.splitSignal,
      };

      uploadInfo.value = {
        ...uploadInfo.value,
        type: "success",
        info: t("chunkSuccess"),
        textData: texts,
      };

      console.log("data", data);
    }
  } else {
    resetStatus();
  }
};

const resetStatus = () => {
  isUseDB.value = false;
  formModel.value = _.cloneDeep(defaultFormModel);
  uploadInfo.value = _.cloneDeep(defaultUploadInfo);
};

const clearDB = async () => {
  const confirmResult = await dialog.confirm({
    title: t("clearDB"),
    message: t("clearDBConfirm"),
    type: "info",
  });

  if (confirmResult) {
    await cachePlugin.deleteVectorDataBaseByName(TEST_DB);
    resetStatus();
    message.success(t("clearDBSuccess"));
  }
};

// 打开文档弹窗
const openDoc = () => {
  if (popup.value) {
    popup.value.open();
  }
};

// 默认结果
const result = ref(t("defaultResult"));

// 上传成功处理
const onUpload = async ({ fileBase64, document }) => {
  const text = await markdownTextLoader(fileBase64);
  uploadInfo.value = {
    ...uploadInfo.value,
    type: "info",
    info: t("uploadSuccess"),
    fileName: document.name,
  };
  formModel.value = {
    ...formModel.value,
    text,
  };
};

// 上传失败处理
const onUploadFailed = (e) => {
  if (e) {
    uploadInfo.value = {
      ...uploadInfo.value,
      type: "danger",
      info: e,
    };
  }
};

// 用户消息模板
const userMessageTemplate = ({ content }) => `${content}`;

// 用户问题
const userQuestion = ref(t("defaultQuestion"));

// 文档引用
const refers = ref([]);

// 执行操作
const execute = async () => {
  loading.value = true;
  refers.value = [];

  // 配置向量存储
  const vectorStoreConfig = {
    type: formModel.value.db,
    name: formModel.value.db === "memory" ? undefined : TEST_DB,
  };

  // 配置微聊
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
        console.log(formModel.value.db);
        if (formModel.value.db === "closeVector") {
          isUseDB.value = true;
        }
        uploadInfo.value = {
          ...uploadInfo.value,
          type: "success",
          info: t("chunkSuccess"),
          textData,
        };
      },
      text: formModel.value.text,
    },
  });

  // 调用微聊
  const { result: answer, refers: docRefers } = await microChat.invoke({
    content: userQuestion.value,
  });

  // 更新结果和引用
  if (docRefers.length > 0) {
    refers.value = docRefers;
  }

  result.value = answer;
  loading.value = false;
};
</script>
