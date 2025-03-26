<template>
  <plugin-page-wrapper>
    <template #pluginConsole>
      <div class="flex h-full flex-col">
        <div class="mb-3">
          <h3 class="my-1.5 flex gap-1 text-sm leading-8 text-gray-700">
            <div>{{ t("domainSettings") }}</div>
            <x-tooltip
              position="right"
              class="flex items-center"
              :text="t('domainSettingsTooltip')"
              ><i-mdi-help-circle-outline
            /></x-tooltip>
          </h3>
          <div class="flex gap-2">
            <x-input
              v-model="comfyUI_API_URL"
              class="flex-1"
              :placeholder="'配置不要带协议，比如 127.0.0.1:8188 即可'"
            />
            <x-button @click="checkState" type="base" size="small"
              ><i-mdi-connection
            /></x-button>
          </div>
        </div>

        <div class="mb-3 flex flex-1 flex-col">
          <div class="flex items-center gap-3">
            <h3 class="my-1.5 flex gap-1 text-sm leading-8 text-gray-700">
              <div>{{ t("workflow") }}</div>
              <x-tooltip
                position="right"
                class="flex items-center"
                :text="t('workflowTooltip')"
                ><i-mdi-help-circle-outline
              /></x-tooltip>
            </h3>

            <x-button
              size="small"
              class="relative h-6 w-12 text-center"
              type="ghost"
            >
              <x-upload @upload="onUpload" accept="application/json">
                <i-mdi-upload class="m-auto mt-1 block" />
              </x-upload>
            </x-button>
          </div>

          <div class="flex-1 overflow-auto md:max-h-[calc(100vh-440px)]">
            <!-- json view -->
            <x-tab :tabs="[t('jsonMode'), t('editMode')]">
              <template #tab-0>
                <div class="rounded border border-gray-300 bg-slate-100 p-2">
                  <vue-json-pretty show-length show-line :data="workflowJSON" />
                </div>
              </template>
              <template #tab-1>
                <x-comfy-ui-panel
                  :key="workflowJSON"
                  ref="comfyUiPanel"
                  :workflowJSON="workflowJSON"
                />
              </template>
            </x-tab>
          </div>
        </div>
      </div>
    </template>
    <template #pluginConsoleOperation>
      <div class="mt-3 flex justify-end gap-2">
        <x-button
          type="base"
          :disabled="executeBtnDisabled"
          class="flex-1"
          @click="executeWorkflow"
          >{{ t("execute") }}</x-button
        >
        <x-button>
          {{ t("save") }}
        </x-button>
      </div>
    </template>

    <template #pluginDebugger>
      <div class="flex h-full flex-col gap-2">
        <div class="flex flex-1 flex-col overflow-auto">
          <div class="flex h-full w-full flex-1 items-center bg-gray-100">
            <x-result v-if="!images[0]" type="404" />
            <x-image-viewer
              class="m-auto flex h-full w-full items-center object-contain"
              v-else
              :src="images[0]"
              ><img
                class="m-auto max-h-full max-w-full object-contain"
                :src="images[0]"
            /></x-image-viewer>
          </div>
        </div>

        <div class="flex h-60 overflow-auto">
          <x-terminal ref="terminalRef" />
        </div>
      </div>
    </template>
  </plugin-page-wrapper>
</template>

<script setup>
import { computed, ref, onUnmounted, onMounted } from "vue";
import { useRoute } from "vue-router";
import { plugins } from "../../data/plugins";
import PluginPageWrapper from "../PluginPageWrapper.vue";
// import microChat from "@/lib/Chat/microChat";

import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";
import dialog from "@/lib/dialog";

import request from "@/lib/request";
import message from "@/lib/message";
import { v4 as uuid } from "uuid";
import ComfyUI from "@/lib/ComfyUI";
import { useNamespace } from "@/i18n";

const terminalRef = ref(null);

const progress = ref(0);

const images = ref([]);

const { t } = useNamespace("PluginsViews.ComfyUI");
const route = useRoute();

const id = route.params.id;
const plugin = plugins.find((plugin) => plugin.id + "" === id + "");

const loading = ref(false);
const workflowJSON = ref(null);

const onUpload = ({ fileBase64: base64String }) => {
  base64String = base64String.replace("data:application/json;base64,", "");
  // json base64 -> json
  try {
    // 解码Base64字符串
    const jsonString = decodeURIComponent(escape(atob(base64String)));
    // 解析JSON字符串
    workflowJSON.value = JSON.parse(jsonString);
  } catch (error) {
    console.error("Failed to decode Base64 JSON:", error);
  }
};

const comfyUI_API_URL = ref("tavern.tomz.io:8188");

const comfyUI = computed(() => {
  return new ComfyUI({
    api_url: comfyUI_API_URL.value,
    terminalRef,
  });
});

const executeBtnDisabled = computed(() => {
  return (
    loading.value ||
    comfyUI_API_URL.value.trim() === "" ||
    workflowJSON.value === null
  );
});

// 检查系统连通性
const checkState = async () => {
  const result = await comfyUI.value.checkState();
  if (result) {
    dialog.confirm({
      type: "info",
      title: "System Stats",
      injectHtml: true,
      message: result,
    });
  }
};

const executeWorkflow = async () => {
  loading.value = true;
  try {
    const result = await comfyUI.value.execute(workflowJSON.value);
    images.value = result;
  } catch (error) {
  } finally {
    loading.value = false;
  }
};

onUnmounted(() => {
  comfyUI.value.closeWebSocket();
});
</script>

<style></style>
