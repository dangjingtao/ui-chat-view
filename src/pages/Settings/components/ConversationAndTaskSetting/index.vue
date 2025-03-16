<template>
  <x-panel :description="t('openProxyDescription')">
    <template #title>{{ t("workModelTitle") }}</template>
    <conversation :providers="providers" />
    <task-llm :providers="providers" />
    <task-embed :providers="providers" />
  </x-panel>
</template>

<script lang="ts" setup>
import cachePlugin from "@/plugins/cachePlugin";
import TaskLlm from "./components/TaskLLM.vue";
import TaskEmbed from "./components/TaskEmbed.vue";
import Conversation from "./components/Conversation.vue";
import { ref } from "vue";
import { useNamespace } from "@/i18n";

const { t } = useNamespace("Settings.WorkModelSetting");

const providers = ref<{ id: string; name: string }[]>([]);

const init = async () => {
  const allProviders = await cachePlugin.getProviders();
  providers.value = allProviders.map((x: any) => ({
    id: x.provider,
    name: x.provider,
  }));
};

init();
</script>
