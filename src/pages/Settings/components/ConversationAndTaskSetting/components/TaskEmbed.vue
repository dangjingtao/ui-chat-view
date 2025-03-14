<template>
  <h3 class="text-md pt-2 leading-12 font-bold">{{ t("llmEmbedModel") }}</h3>

  <x-panel-item
    :name="t('embeddingProvider')"
    :description="t('embeddingProviderDescription')"
  >
    <template #formItem>
      <x-select
        class="mt-2"
        :options="props.providers"
        @change="setEmbeddingTaskProvider"
        :selectedValue="embedTaskProvider"
      />
    </template>
  </x-panel-item>

  <x-panel-item :border="true" :name="t('embeddingModel')">
    <template #formItem>
      <x-select
        :dropdownClass="`w-[280px] max-h-[200px]`"
        :isLoading="loading"
        class="mt-2"
        @change="setEmbeddingTaskModel"
        :options="embedTaskModelList"
        :selectedValue="embedTaskModel"
      />
    </template>
  </x-panel-item>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import message from "@/lib/message";
import cachePlugin from "@/plugins/cachePlugin";
import { useNamespace } from "@/i18n";

const { t } = useNamespace("Settings.TaskEmbedSetting");

const loading = ref(false);
const props = defineProps<{
  providers: { id: string; name: string }[];
}>();

const embedTaskProvider = ref("");
const embedTaskModel = ref("");
const embedTaskModelList = ref<{ id: string; name: string }[]>([]);

const handleUpdateTaskModel = async () => {
  loading.value = true;
  try {
    const dataBaseEmbedTaskModelList = await cachePlugin.getTaskEmbedModels();
    embedTaskModelList.value = dataBaseEmbedTaskModelList;

    const dataBaseEmbedTaskModel = await cachePlugin.getTaskEmbedModel();

    if (
      !dataBaseEmbedTaskModelList.find(
        (model) => model.name === dataBaseEmbedTaskModel,
      )
    ) {
      await cachePlugin.setTaskEmbedModel("");
      embedTaskModel.value = "";
      message.warning(t("modelListUpdated"));
    } else {
      embedTaskModel.value = dataBaseEmbedTaskModel;
    }
  } catch (error) {
    message.error(t("updateFailed"));
  } finally {
    loading.value = false;
  }
};

const init = async () => {
  try {
    embedTaskProvider.value = await cachePlugin.getTaskEmbedProvider();
    await handleUpdateTaskModel();
  } catch (error) {
    message.error(t("initFailed"));
  }
};

init();

const setEmbeddingTaskProvider = async (provider: string) => {
  try {
    await cachePlugin.setTaskEmbedProvider(provider);
    await handleUpdateTaskModel();
  } catch (error) {
    message.error(t("providerUpdateFailed"));
  }
};

const setEmbeddingTaskModel = async (model: string) => {
  try {
    await cachePlugin.setTaskEmbedModel(model);
    embedTaskModel.value = model;
    message.success(t("setSuccess"));
  } catch (error) {
    message.error(t("modelUpdateFailed"));
  }
};
</script>
