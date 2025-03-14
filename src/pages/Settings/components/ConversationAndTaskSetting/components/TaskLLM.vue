<template>
  <h3 class="text-md pt-2 leading-12 font-bold">{{ t("llmTaskModel") }}</h3>
  <x-panel-item
    :name="t('llmTaskProvider')"
    :description="t('llmTaskDescription')"
  >
    <template #formItem>
      <x-select
        class="mt-2"
        :options="props.providers"
        :selectedValue="llmTaskProvider"
        @change="setLLMTaskProvider"
      />
    </template>
  </x-panel-item>

  <x-panel-item
    :border="true"
    :name="t('llmTaskModel')"
    :description="t('llmTaskModelDescription')"
  >
    <template #formItem>
      <x-select
        :isLoading="loading"
        :dropdownClass="`w-[280px] max-h-[300px]`"
        class="mt-2"
        @change="setLLMTaskModel"
        :options="llmTaskModelList"
        :selectedValue="llmTaskModel"
      />
    </template>
  </x-panel-item>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import message from "@/lib/message";
import cachePlugin from "@/plugins/cachePlugin";
import { useNamespace } from "@/i18n";

const { t } = useNamespace("Settings.TaskLLMSetting");

const props = defineProps<{
  providers: { id: string; name: string }[];
}>();

const loading = ref(false);
const llmTaskProvider = ref("");
const llmTaskModel = ref("");
const llmTaskModelList = ref<{ id: string; name: string }[]>([]);

const handleUpdateTaskModel = async () => {
  loading.value = true;
  try {
    const dataBaseLLMTaskModelList = await cachePlugin.getTaskLLMModels();
    llmTaskModelList.value = dataBaseLLMTaskModelList;

    const dataBaseLLMTaskModel = await cachePlugin.getTaskLLMModel();

    if (
      !dataBaseLLMTaskModelList.find(
        (model) => model.name === dataBaseLLMTaskModel,
      )
    ) {
      await cachePlugin.setTaskLLMModel("");
      llmTaskModel.value = "";
      message.warning(t("modelListUpdated"));
    } else {
      llmTaskModel.value = dataBaseLLMTaskModel;
    }
  } catch (error) {
    message.error(t("updateFailed"));
  } finally {
    loading.value = false;
  }
};

const init = async () => {
  try {
    llmTaskProvider.value = await cachePlugin.getTaskLLMProvider();
    await handleUpdateTaskModel();
  } catch (error) {
    message.error(t("initFailed"));
  }
};

init();

const setLLMTaskProvider = async (provider: string) => {
  try {
    await cachePlugin.setTaskLLMProvider(provider);
    llmTaskProvider.value = provider;
    await handleUpdateTaskModel();
  } catch (error) {
    message.error(t("providerUpdateFailed"));
  }
};

const setLLMTaskModel = async (model: string) => {
  try {
    await cachePlugin.setTaskLLMModel(model);
    llmTaskModel.value = model;
  } catch (error) {
    message.error(t("modelUpdateFailed"));
  }
};
</script>
