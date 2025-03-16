<template>
  <x-panel-item :name="t('llmProviderName')">
    <template #formItem>
      <div class="flex w-[200px] max-w-60 gap-1">
        <x-select
          class="mt-2"
          :options="props.providers"
          :selectedValue="llmProvider"
          @change="setLLMProvider"
        />
        <x-button @click="openDialog" type="base" class="my-auto h-8 leading-3">
          <i-mdi-settings-outline />
        </x-button>
      </div>
    </template>
  </x-panel-item>

  <x-panel-item
    :name="t('imageGenerationSchemeName')"
    :description="t('imageGenerationSchemeDescription')"
  >
    <template #formItem>
      <x-select
        class="mt-2"
        :dropdownClass="`w-[280px] right-[0px]`"
        :options="[
          { id: 'comfy_ui', name: 'Comfy UI' },
          {
            id: 'stable_diffusion',
            name: 'Automatic 1111 (Stable Diffusion)',
          },
        ]"
      />
    </template>
  </x-panel-item>

  <x-panel-item
    :border="true"
    :name="t('ttsSchemeName')"
    :description="t('ttsSchemeDescription')"
  >
    <template #formItem>
      <x-select class="mt-2" :options="[]" />
    </template>
  </x-panel-item>
  <x-dialog
    v-model:visible="dialogVisible"
    :footer="false"
    @confirm="setLLMProviderDomain"
  >
    <template #header> {{ t("customerBaseURL") }} {{ llmProvider }}</template>
    <template #body>
      <x-form :model="formData" ref="formRef">
        <x-formItem name="baseURL" label="Base URL">
          <div class="flex gap-1">
            <x-input
              class="flex-1"
              placeholder="如 http://127.0.0.1:11434"
              v-model="formData.baseURL"
            />
            <x-button @click="restore" type="base">
              <i-mdi-restore />
            </x-button>
          </div>
        </x-formItem>
        <x-formItem name="apiKey" label="API Key">
          <x-input v-model="formData.apiKey" placeholder="apiKey (选填)" />
        </x-formItem>
      </x-form>
    </template>
  </x-dialog>
</template>

<script lang="ts" setup>
import message from "@/lib/message";
import cachePlugin from "@/plugins/cachePlugin";
import { ref } from "vue";
import { useNamespace } from "@/i18n";

const { t } = useNamespace("Settings.WorkModelSetting");

const formData = ref({
  baseURL: "",
  apiKey: "",
});

const llmProvider = ref("");
const dialogVisible = ref(false);

const openDialog = async () => {
  const settings = await cachePlugin.getConversationLLMProviderSetting(
    llmProvider.value,
  );
  formData.value = {
    baseURL: settings.customerBaseURL || settings.baseURL,
    apiKey: settings.apiKey,
  };
  dialogVisible.value = true;
};

const restore = async () => {
  const settings = await cachePlugin.getConversationLLMProviderSetting(
    llmProvider.value,
  );
  formData.value = {
    baseURL: settings.baseURL,
    apiKey: settings.apiKey,
  };
};

const props = defineProps<{
  providers: { id: string; name: string }[];
}>();

const init = async () => {
  const provider = await cachePlugin.getConversationLLMProvider();
  llmProvider.value = provider;
};

init();

const setLLMProvider = async (provider) => {
  await cachePlugin.setConversationLLMProvider(provider);
  llmProvider.value = provider;
  message.success(t("setSuccess"));
};

const setLLMProviderDomain = async () => {
  if (!formData.value.baseURL) {
    message.error(t("baseURLRequired"));
    return;
  }
  await cachePlugin.setConversationLLMProviderDomain({
    provider: llmProvider.value,
    baseURL: formData.value.baseURL,
    apiKey: formData.value.apiKey,
  });
  dialogVisible.value = false;
  formData.value = {
    baseURL: "",
    apiKey: "",
  };
  message.success(t("setSuccess"));
};
</script>
