<template>
  <div
    class="flex h-auto flex-col pt-2 md:h-full md:flex-row md:space-x-4 md:pt-0"
  >
    <div class="relative flex w-full flex-col py-4 md:mb-0 md:w-[500px]">
      <div
        class="flex h-full w-full flex-col rounded-lg border border-gray-300 bg-gray-50 p-4"
      >
        <div class="my-4 mt-1 px-0.5">
          <h2
            class="flex items-center justify-between text-lg leading-12 font-bold text-gray-700"
          >
            <div class="flex items-center gap-2">
              <div
                class="border-primary-3 bg-primary-1 text-primary flex h-8 w-8 items-center justify-center rounded-md text-center"
              >
                <x-image
                  class="h-6 w-6 rounded-lg"
                  :src="plugin.icon"
                  alt="ComfyUI"
                />
              </div>
              {{ t("overview") }}&nbsp;
              <div>
                <x-tag :text="'v ' + plugin.version" />
              </div>
            </div>
            <x-switch :title="t('enable')" />
          </h2>
          <p class="leader-8 text-sm text-gray-600">{{ plugin.description }}</p>
        </div>

        <div class="flex-1 overflow-auto px-0.5">
          <slot name="pluginConsole"></slot>
        </div>

        <div class="px-0.5">
          <slot name="pluginConsoleOperation"></slot>
        </div>
      </div>
    </div>
    <div class="relative flex flex-1 flex-col py-4 md:mb-0">
      <slot name="pluginDebugger"></slot>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import microChat from "@/lib/Chat/microChat";
import copy from "@/lib/textProcessor/copy";
import { useNamespace } from "@/i18n";
import { plugins } from "../data/plugins";

const { t } = useNamespace("PluginsViews.Index");
const route = useRoute();

const id = route.params.id;
const plugin = plugins.find((plugin) => plugin.id + "" === id + "");

const enable = ref(false);

const togglePlugin = () => {
  enable.value = !enable.value;
};
</script>

<style>
/* 你可以在这里添加自定义样式 */
</style>
