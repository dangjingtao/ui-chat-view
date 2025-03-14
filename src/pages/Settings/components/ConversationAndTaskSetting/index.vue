<template>
  <x-panel :description="t('openProxyDescription')">
    <template #title>{{ t("workModelTitle") }}</template>

    <x-panel-item :name="t('llmProviderName')">
      <template #formItem>
        <x-select
          class="mt-2"
          :options="providers"
          :selectedValue="llmProvider"
          @change="setLLMProvider"
        />
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

    <task-llm :providers="providers" />
    <task-embed :providers="providers" />
  </x-panel>
</template>

<script lang="ts" setup>
import message from "@/lib/message";
import cachePlugin from "@/plugins/cachePlugin";
import TaskLlm from "./components/TaskLLM.vue";
import TaskEmbed from "./components/TaskEmbed.vue";
import { ref } from "vue";
import { useNamespace } from "@/i18n";

const { t } = useNamespace("Settings.WorkModelSetting");

const providers = ref<{ id: string; name: string }[]>([]);

const llmProvider = ref("");

const init = async () => {
  const allProviders = await cachePlugin.getProviders();
  providers.value = allProviders.map((x) => ({
    id: x.provider,
    name: x.provider,
  }));

  llmProvider.value = await cachePlugin.getConversationLLMProvider();
};

init();

const setLLMProvider = async (provider) => {
  await cachePlugin.setConversationLLMProvider(provider);
  llmProvider.value = provider;
  message.success(t("setSuccess"));
};
</script>
