<template>
  <plugin-page-wrapper>
    <template #pluginConsole>
      <model-card />
      <form-item
        :label="t(`promptTemplate`)"
        :tooltip="t('promptTemplateTooltip')"
      >
        <x-textarea disabled rows="8" :placeholder="systemMessageExample" />
      </form-item>

      <form-item :label="t('temperature')" :tooltip="t('temperatureTooltip')">
        <x-slider
          class="w-full"
          v-model="settings.temperature"
          :min="0"
          :max="2"
          :step="0.01"
        />
      </form-item>

      <form-item :label="t('maxTokens')" :tooltip="t('maxTokensTooltip')">
        <x-slider
          class="w-full"
          v-model="settings.maxTokens"
          :min="100"
          :max="10000"
          :step="1"
        />
      </form-item>
    </template>
    <template #pluginConsoleOperation>
      <div class="mt-6 flex justify-end gap-2">
        <x-button
          type="ghost"
          @click="() => (settings.value = defaultSettings)"
        >
          {{ t("reset") }}
        </x-button>

        <x-button @click="() => (settings.value = defaultSettings)">
          {{ t("save") }}
        </x-button>
      </div>
    </template>

    <template #pluginDebugger>
      <div class="mb-2 flex gap-2">
        <x-select
          :selectedValue="'any'"
          class="w-full max-w-full"
          :options="[{ id: 'any', name: t('anyLanguage') }]"
        />
        <x-button :disabled="loading || !inputText" @click="translate">
          <i-mdi-translate-variant />
        </x-button>
      </div>
      <x-textarea
        resize="none"
        v-model="inputText"
        placeholder="Enter text to translate"
        class="h-[300px] w-full p-2 md:h-full"
      ></x-textarea>

      <div class="my-2 flex gap-2">
        <x-select
          :selectedValue="outputLanguage"
          @change="onChangeOutputLanguage"
          class="w-full max-w-full flex-1"
          :dropdownClass="'max-h-30 w-full'"
          :options="languages"
        />
        <x-button :disabled="loading || !outputText" @click="cp">
          <i-mdi-clipboard-multiple-outline />
        </x-button>
      </div>
      <x-textarea
        v-model="outputText"
        placeholder="Translation will appear here"
        resize="none"
        readonly
        aria-readonly="true"
        class="h-[300px] w-full md:h-full"
      />
    </template>
  </plugin-page-wrapper>
</template>

<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import microChat from "@/lib/Chat/microChat";
import copy from "@/lib/textProcessor/copy";
import { useNamespace } from "@/i18n";
import { plugins } from "../../data/plugins";
import PluginPageWrapper from "../PluginPageWrapper.vue";
import FormItem from "../FormItem.vue";
import ModelCard from "../ModelCard.vue";

const { t } = useNamespace("PluginsViews.Translate");
const route = useRoute();

const id = route.params.id;
const plugin = plugins.find((plugin) => plugin.id + "" === id + "");
const defaultSettings = {
  temperature: 0,
  maxTokens: 4096,
};
const languages = [
  { id: "english", name: "English" },
  { id: "chinese", name: "Chinese" },
  { id: "spanish", name: "Spanish" },
  { id: "french", name: "French" },
  { id: "german", name: "German" },
  { id: "italian", name: "Italian" },
  { id: "japanese", name: "Japanese" },
  { id: "korean", name: "Korean" },
  { id: "russian", name: "Russian" },
  { id: "arabic", name: "Arabic" },
  { id: "portuguese", name: "Portuguese" },
  { id: "dutch", name: "Dutch" },
  // 其他语言选项
];

const settings = ref(defaultSettings);
const loading = ref(false);
const inputText = ref("");
const outputText = ref("");
const outputLanguage = ref("english");

const cp = () => {
  copy(outputText.value);
};

const systemMessage =
  "You are a professional, authentic machine translation engine";
const userMessageTemplate = ({
  text,
  to,
}) => `Treat next line as plain text input and translate it into ${to}, output translation ONLY. If translation is unnecessary (e.g. proper nouns, codes, etc.), return the original text. NO explanations. NO notes. Input:
 ${text}`;

const systemMessageExample = `[systemMessage]: "${systemMessage}" 
[userMessageTemplate]: "${userMessageTemplate({ text: "{text}", to: "{Language}" })}"
`;

// 注册插件消息处理
microChat.useConfig({
  pluginId: id,
  client: "default",
  memory: false,
  systemMessage,
  userMessageTemplate,
  advanceOptions: {
    maxTokens: settings.value.maxTokens,
    temperature: settings.value.temperature,
  },
  onError: (error) => {
    console.error(error);
  },
});

const onChangeOutputLanguage = (e) => {
  outputLanguage.value = e;
};

const translate = async () => {
  loading.value = true;

  const { result } = await microChat.invoke({
    text: inputText.value,
    to: outputLanguage.value,
  });

  loading.value = false;
  console.error(result);
  outputText.value = result;
};
</script>

<style>
/* 你可以在这里添加自定义样式 */
</style>
