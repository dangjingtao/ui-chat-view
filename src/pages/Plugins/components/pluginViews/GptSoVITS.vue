<template>
  <plugin-page-wrapper>
    <template #pluginConsole>
      <div class="mb-1 flex gap-2">
        <form-item
          class="w-[200px] flex-1"
          :label="t('language')"
          :tooltip="t('exampleLanguageTooltip')"
        >
          <x-model-select
            v-model="settings.exampleLanguage"
            class="max-w-full flex-1"
            :options="languages"
          />
        </form-item>

        <form-item
          class="max-w-[230px] flex-1"
          :label="t('exampleAudio')"
          :tooltip="t('exampleAudioTooltip')"
        >
          <x-model-select
            v-model="settings.exampleAudio"
            :dropdown-class="'w-[300px]  md:w-[400px]'"
            class="max-w-full flex-1"
            @change="onChangeSampleAudio"
            :options="samplingAudios"
            @delete-option="handleDeleteOption"
          />
          <x-button class="relative w-9 text-center" type="ghost">
            <x-upload
              @upload="onUpload"
              accept="application/json, audio/wav, audio/*"
            >
              <i-mdi-upload class="m-auto mt-[7px] block" />
            </x-upload>
          </x-button>
        </form-item>
      </div>

      <form-item :label="t('exampleText')">
        <x-textarea
          :placeholder="t('exampleTextHolder')"
          v-model="settings.exampleText"
        />
      </form-item>

      <form-item
        :label="t('targetLanguage')"
        :tooltip="t('targetLanguageTooltip')"
      >
        <x-model-select
          class="max-w-full flex-1"
          v-model="settings.targetLanguage"
          :options="languages"
        />
      </form-item>

      <form-item :label="t('samplingStep')" :tooltip="t('samplingStepTooltip')">
        <x-model-select
          v-model="settings.samplingStep"
          class="max-w-full flex-1"
          :options="samplingSteps"
        />
      </form-item>

      <x-split class="mt-6" text="语速调整，高为更快" />

      <form-item :label="t('splitType')" :tooltip="t('splitTypeTooltip')">
        <x-model-select
          v-model="settings.splitType"
          class="max-w-full flex-1"
          :options="splitTypes"
        />
      </form-item>

      <div class="flex gap-2">
        <form-item
          class="flex-1"
          :label="t('speechRate')"
          :tooltip="t('speechRateTooltip')"
        >
          <x-slider
            class="w-full"
            v-model="settings.speechRate"
            :min="0.6"
            :max="1.65"
            :step="0.05"
          />
        </form-item>

        <form-item
          class="flex-1"
          :label="t('sentencePause')"
          :tooltip="t('sentencePauseTooltip')"
        >
          <x-slider
            class="w-full"
            v-model="settings.sentencePause"
            :min="0.1"
            :max="0.5"
            :step="0.01"
          />
        </form-item>
      </div>

      <x-split class="mt-6" text="GPT采样参数(不懂就用默认)" />

      <form-item :label="t('temperature')" :tooltip="t('temperatureTooltip')">
        <x-slider
          class="w-full"
          v-model="settings.temperature"
          :min="0"
          :max="1"
          :step="0.05"
        />
      </form-item>

      <div class="flex gap-2">
        <form-item
          class="flex-1"
          :label="t('topK')"
          :tooltip="t('topKTooltip')"
        >
          <x-slider
            class="w-full"
            v-model="settings.topK"
            :min="1"
            :max="100"
            :step="1"
          />
        </form-item>

        <form-item
          class="flex-1"
          :label="t('topP')"
          :tooltip="t('topPTooltip')"
        >
          <x-slider
            class="w-full"
            v-model="settings.topP"
            :min="0"
            :max="1"
            :step="0.05"
          />
        </form-item>
      </div>
    </template>

    <template #pluginConsoleOperation>
      <x-button :loading="loading" @click="execute" class="mt-5 w-full">{{
        t("execute")
      }}</x-button>
    </template>

    <template #pluginDebugger>
      <div class="flex h-full flex-col gap-5">
        <form-item>
          <x-audio :src="audioSrc" />
        </form-item>
        <form-item class="flex-1">
          <x-textarea class="h-full" :rows="10" v-model="settings.targetText" />
        </form-item>
      </div>
    </template>
  </plugin-page-wrapper>
</template>

<script setup>
import { ref, watch, nextTick } from "vue";
import { useRoute } from "vue-router";
import microChat from "@/lib/Chat/microChat";
import { useNamespace } from "@/i18n";
import { plugins } from "../../data/plugins";
import PluginPageWrapper from "../PluginPageWrapper.vue";
import FormItem from "../FormItem.vue";
import cachePlugin from "@/plugins/cachePlugin";
import { Client } from "https://cdn.jsdelivr.net/npm/@gradio/client/dist/index.min.js";
import message from "@/lib/message";
import { base64ToBlob, generateBlobURL } from "@/utils/file";
import testArticle from "../../asset/baijie.md?raw";

const { t } = useNamespace("PluginsViews.GptSoVitsV3");
const route = useRoute();

const id = route.params.id;
const plugin = plugins.find((plugin) => plugin.id + "" === id + "");

const defaultSettings = {
  exampleLanguage: "中文",
  exampleAudio: "",
  exampleText: "",
  targetLanguage: "中文",
  samplingStep: 32,
  splitType: "按中文句号。切",
  speechRate: 1,
  sentencePause: 0.3,
  temperature: 1,
  topK: 15,
  topP: 1,
  targetText: testArticle,
};

const samplingSteps = [
  { id: 4, name: 4 },
  { id: 8, name: 8 },
  { id: 16, name: 16 },
  { id: 32, name: 32 },
];

const languages = [
  { id: "中文", name: "中文" },
  { id: "粤语", name: "粤语" },
  { id: "英文", name: "英文" },
  { id: "日文", name: "日文" },
  { id: "韩文", name: "韩文" },
];

const splitTypes = [
  { id: "不切", name: "不切" },
  { id: "凑四句一切", name: "凑四句一切" },
  { id: "凑50字一切", name: "凑50字一切" },
  { id: "按中文句号。切", name: "按中文句号。切" },
  { id: "按英文句号.切", name: "按英文句号.切" },
  { id: "按标点符号切", name: "按标点符号切" },
];

const settings = ref(defaultSettings);
const samplingAudios = ref([]);

// 刷新采样音频
const getSampleAudios = async () => {
  try {
    const result = await cachePlugin.getSampleAudios();
    samplingAudios.value = result;

    const isSamplingAudioIdInList = !result.find(
      (item) => item.id === settings.value.exampleAudio,
    );
    if (isSamplingAudioIdInList) {
      settings.value.exampleAudio = "";
    }
  } catch (error) {
    console.error("Failed to fetch sample audios:", error);
    message.error(t("fetchSampleAudioError"));
  }
};

getSampleAudios();

const handleDeleteOption = async (samplingAudioId) => {
  await cachePlugin.deleteSamplingAudio(samplingAudioId);
  await getSampleAudios();
};

// 上传入库
const onUpload = async ({ fileBase64, document }) => {
  const record = {
    name: document.name,
    type: document.type,
    size: document.size,
    blob: base64ToBlob(fileBase64, document.type),
  };

  // console.log(record);
  await cachePlugin.addSamplingAudios(record);
  await getSampleAudios();
};

// 操作糖：自动填充
const onChangeSampleAudio = async (id) => {
  const { name: audioName } =
    samplingAudios.value.find((item) => item.id === id) || {};
  if (audioName) {
    const regex = /^\[.*?\](.+)\.\w+$/;
    const [_, languageContent] = audioName.match(regex) || [];
    if (languageContent) {
      settings.value.exampleText = languageContent;
    }
  }
};

// 删除代码
function processAudioUrl(audioUrl, isProduction) {
  if (isProduction) {
    return audioUrl.replace(
      "https://tavern.tomz.io",
      "https://tavern.tomz.io:9873",
    );
  }
  return audioUrl;
}

// 判断是否是生产环境
const isProduction = import.meta.env.PROD;
const url = isProduction
  ? "https://tavern.tomz.io:9873/"
  : `${location.protocol}//${location.host}/gptsovits/`;

const audioSrc = ref("");
const loading = ref(false);

const execute = async () => {
  try {
    const samplingAudio = samplingAudios.value.find(
      (item) => item.id === settings.value.exampleAudio,
    );

    if (!samplingAudio?.blob || !settings.value.exampleText) {
      message.warning(t("formValidateMessage"));
      return;
    }

    const params = [
      samplingAudio.blob,
      settings.value.exampleText,
      settings.value.exampleLanguage,
      settings.value.targetText,
      settings.value.targetLanguage,
      settings.value.splitType,
      settings.value.topK,
      settings.value.topP,
      settings.value.temperature,
      false,
      settings.value.speechRate,
      false,
      null,
      settings.value.samplingStep,
      true,
      settings.value.sentencePause,
    ];

    loading.value = true;
    const app = await Client.connect(url);
    const result = await app.predict("/get_tts_wav", params);
    let audioUrl = processAudioUrl(result?.data?.[0]?.url || "");

    audioSrc.value = await generateBlobURL(audioUrl);
    message.success(t("executeSuccess"));
  } catch (error) {
    message.error(t("processError"));
    console.error(error);
  } finally {
    loading.value = false;
  }
};
</script>
