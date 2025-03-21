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
            <x-input class="flex-1" :placeholder="'http://127.0.0.1:8188'" />
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

          <div class="flex-1 overflow-auto md:max-h-[500px]">
            <!-- json view -->
            <x-tab :tabs="[t('jsonMode'), t('editMode')]">
              <template #tab-0>
                <div class="rounded border border-gray-300 bg-slate-100 p-2">
                  <vue-json-pretty show-length show-line :data="workflowJSON" />
                </div>
              </template>
              <template #tab-1>
                <x-comfy-ui-panel
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
        <x-button type="base" class="flex-1" @click="execute">{{
          t("execute")
        }}</x-button>
        <x-button @click="() => (settings.value = defaultSettings)">
          {{ t("save") }}
        </x-button>
        <!-- <x-button
          type="ghost"
          @click="() => (settings.value = defaultSettings)"
        >
          {{ t("reset") }}
        </x-button>

         -->
      </div>
    </template>

    <template #pluginDebugger>
      <div class="flex h-full flex-col gap-2">
        <div class="flex h-full w-full flex-1 flex-col">
          <x-progress class="mb-2" :progress="progress" />
          <div class="flex h-full w-full flex-1 items-center bg-gray-100">
            <x-result v-if="!images[0]" type="404" />
            <x-image-viewer class="m-auto" v-else :src="image(`${images[0]}`)"
              ><x-image
                class="m-auto max-h-fit max-w-full"
                :src="image(images[0])"
            /></x-image-viewer>
          </div>
        </div>

        <div class="flex h-40 gap-2 overflow-auto">
          <div
            class="h-40 w-1/6 flex-shrink-0"
            v-for="(im, index) in images.slice(0, 6)"
            :key="index"
          >
            <img class="h-full w-full object-contain" :src="image(im)" />
          </div>
        </div>
      </div>
    </template>
  </plugin-page-wrapper>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import microChat from "@/lib/Chat/microChat";
import copy from "@/lib/textProcessor/copy";
import { useNamespace } from "@/i18n";
import { plugins } from "../../data/plugins";
import PluginPageWrapper from "../PluginPageWrapper.vue";
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";
import dialog from "@/lib/dialog";

import request from "@/lib/request";

const comfyUiPanel = ref(null);

const formatSystemStats = (data) => {
  const { system, devices } = data;
  return `
    <div class="text-gray-700">
      <h2 class="font-bold leader-8">系统信息:</h2>
      <p>操作系统: ${system.os}</p>
      <p>总内存: ${(system.ram_total / 1024 ** 3).toFixed(2)} GB</p>
      <p>可用内存: ${(system.ram_free / 1024 ** 3).toFixed(2)} GB</p>
      <p>ComfyUI 版本: ${system.comfyui_version}</p>
      <p>Python 版本: ${system.python_version}</p>
      <p>PyTorch 版本: ${system.pytorch_version}</p>
      <p>嵌入式 Python: ${system.embedded_python ? "是" : "否"}</p>
      <p>启动参数: ${system.argv.join(" ")}</p>
    </div>
    <br>
    <div class="text-gray-700">
      <h2 class="font-bold leader-8">设备信息:</h2>
      ${devices
        .map(
          (device) => `
        <div>
          <p>名称: ${device.name}</p>
          <p>类型: ${device.type}</p>
          <p>索引: ${device.index}</p>
          <p>总显存: ${(device.vram_total / 1024 ** 3).toFixed(2)} GB</p>
          <p>可用显存: ${(device.vram_free / 1024 ** 3).toFixed(2)} GB</p>
          <p>Torch 总显存: ${(device.torch_vram_total / 1024 ** 3).toFixed(2)} GB</p>
          <p>Torch 可用显存: ${(device.torch_vram_free / 1024 ** 3).toFixed(2)} GB</p>
        </div>
      `,
        )
        .join("")}
    </div>
  `;
};

const formatValue = (value) => {
  if (Array.isArray(value)) {
    return value.join(", ");
  }
  return value;
};

const progress = ref(0);

const images = ref([]);

const getFormState = () => {
  if (comfyUiPanel.value) {
    const formState = comfyUiPanel.value.getWorkflowJSON();
    console.error(formState);
  }
};

const execute = async () => {
  progress.value = 0;
  const { data } = await request({
    url: "http://127.0.0.1:8188/prompt",
    method: "POST",
    data: {
      prompt: workflowJSON.value,
    },
  });

  const { prompt_id, node_errors, number } = data;
  if (Object.keys(node_errors).length > 0) {
    dialog.confirm({
      type: "info",
      title: "Node Errors",
      message: JSON.stringify(node_errors, null, 2),
    });
  } else {
    let ws;
    const connectWebSocket = () => {
      ws = new WebSocket(`ws://127.0.0.1:8188/ws?clientId=${prompt_id}`);

      ws.onopen = () => {
        console.log("WebSocket connection established");
      };

      ws.onmessage = async (event) => {
        const { type, data } = JSON.parse(event.data);
        if (type === "progress") {
          const { value, max, prompt_id } = data;
          const currentProgress = Math.floor((value / max) * 100);
          progress.value = currentProgress;
        } else if (type === "status") {
          progress.value = 100;
          const { data } = await request({
            url: `http://127.0.0.1:8188/history/${prompt_id}`,
            method: "GET",
          });
          console.error(data[prompt_id].outputs);
          let _images = [];
          Object.keys(data[prompt_id].outputs).forEach((key) => {
            const output = data[prompt_id].outputs[key];
            if (output.images) {
              Object.keys(output.images).forEach((key) => {
                _images.push(output.images[key].filename);
              });
            }
          });
          console.error(_images);
          images.value = [...images.value, ..._images];
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      ws.onclose = (event) => {
        console.log("WebSocket connection closed:", event);
        // Optionally implement reconnection logic here
        setTimeout(connectWebSocket, 1000); // Attempt to reconnect after 1 second
      };
    };

    connectWebSocket();

    // Clean up WebSocket connection when the component is destroyed
    onBeforeUnmount(() => {
      if (ws) {
        ws.close();
      }
    });
  }
};
const image = (filename) =>
  `http://127.0.0.1:8188/view?filename=${filename}&type=output`;

const checkState = async () => {
  const { data } = await request({
    url: "http://127.0.0.1:8188/system_stats",
    method: "GET",
  });

  dialog.confirm({
    type: "info",
    title: "System Stats",
    injectHtml: true,
    message: formatSystemStats(data),
  });

  // console.error(result);
};

const { t } = useNamespace("PluginsViews.ComfyUI");
const route = useRoute();

const id = route.params.id;
const plugin = plugins.find((plugin) => plugin.id + "" === id + "");

const loading = ref(false);
const workflowJSON = ref(null);

const cp = () => {
  copy(outputText.value);
};

const onUpload = ({ fileBase64: base64String }) => {
  console.error(base64String);
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
</script>

<style>
/* 你可以在这里添加自定义样式 */
</style>
