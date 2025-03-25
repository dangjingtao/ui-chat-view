<template>
  <x-subpage-wrapper
    :title="t('pageTitle')"
    :isFullWidth="props.isFullWidth"
    @onClose="props.onClose"
  >
    <template #content>
      <div class="flex h-full flex-col p-4">
        <div class="pb-2 text-gray-700">
          每一个插件，本身都是一个工具(tool), 也是微应用制作器（写太累了）
        </div>
        <div class="mb-4 flex items-center justify-between gap-3">
          <x-input
            type="search"
            placeholder="搜索插件"
            @onSearch="onSearch"
            @onClear="onClear"
            class="flex-1"
          />
          <!-- <x-button>添加插件</x-button> -->
        </div>

        <div
          v-if="plugins.length === 0"
          class="flex h-full flex-col items-center justify-center"
        >
          <x-result class="md:w-[50%]" type="404" title="没有找到插件" />
        </div>

        <div
          v-else
          class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <x-card
            v-for="plugin in plugins"
            :key="plugin.id"
            class="overflow-hidden rounded-lg bg-white hover:shadow-sm dark:bg-slate-200"
          >
            <template #header>
              <div class="flex items-center justify-between gap-4">
                <div class="flex items-center gap-2 text-lg font-semibold">
                  <x-image class="h-6 w-6" :src="plugin.icon" />
                  {{ plugin.name }}
                </div>
              </div>
            </template>
            <template #body>
              <p class="line-clamp-3 leading-6 text-gray-600">
                {{ plugin.description }}
              </p>
            </template>
            <template #footer>
              <div class="flex w-full justify-end gap-4">
                <x-button type="base" @click="() => viewPlugin(plugin.id)">
                  调试
                </x-button>
              </div>
            </template>
          </x-card>
        </div>
      </div>
    </template>
  </x-subpage-wrapper>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { loadModuleTranslations, useNamespace } from "@/i18n";
import { plugins as pluginData } from "./data/plugins";
import { useRouter } from "vue-router";
import { searchPlugin } from "./utils/search";

const router = useRouter();
const viewPlugin = (id: number) => {
  router.push(`/plugins/${id}`);
};

loadModuleTranslations("pages/Plugins");
const { t } = useNamespace("Index");

const props = defineProps<{
  isFullWidth?: boolean;
  onClose?: () => void;
}>();

const plugins = ref(pluginData);

const onSearch = (value: string) => {
  if (!value) {
    plugins.value = pluginData;
    return;
  }
  // 搜索插件逻辑
  const searchResult = searchPlugin(value, pluginData);
  plugins.value = searchResult;
};

const onClear = () => {
  // 清除搜索逻辑
  plugins.value = pluginData;
};
</script>

<style scoped>
/* 手机端体验优化 */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
