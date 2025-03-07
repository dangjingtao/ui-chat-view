<template>
  <div>
    <div class="flex gap-5">
      <h2 @click="toAbout" class="text-geekblue-6 cursor-pointer text-lg">
        程序更新检查
      </h2>
      <x-button @click="removeCache" size="small">解决更新bug</x-button>
    </div>
    <div
      class="mt-2 rounded-md border border-gray-200 bg-gray-50 p-2 text-sm text-gray-600"
    >
      "解决更新bug" 后，您本地的聊天记录将被清空。
    </div>
  </div>

  <div
    class="mt-4 rounded-md border border-gray-200 bg-gray-50 p-2 text-sm text-gray-600"
  >
    <h2 class="pt-0.5 leading-8 font-bold sm:text-lg">语言</h2>
    <p>选择应用程序语言（你现在选了也没有用）</p>
    <!-- <x-select
      class="mt-2"
      :options="[
        { id: 'zh-CN', name: '简体中文' },
        { id: 'en-US', name: 'English' },
      ]"
      selectedValue="zh-CN"
    /> -->
  </div>

  <div
    class="mt-4 rounded-md border border-gray-200 bg-gray-50 p-2 text-sm text-gray-600"
  >
    <h2 class="pt-0.5 leading-8 font-bold sm:text-lg">通用</h2>

    <div class="flex flex-col gap-1.5">
      <div class="flex justify-between">
        <div class="mt-2 min-w-[100px] leading-[30px]">主题</div>
        <!-- <x-select
          class="mt-2"
          :options="[
            { id: 'light', name: 'Light' },
            { id: 'dark', name: 'Dark' },
          ]"
          selectedValue="light"
        /> -->
      </div>

      <div class="flex justify-between">
        <div class="mt-2 min-w-[100px] leading-[30px]">token检查</div>
        <x-switch class="mt-2" :modelValue="false" />
      </div>

      <div class="flex justify-between">
        <div class="mt-2 min-w-[100px] leading-[30px]">输出时间</div>
        <x-switch class="mt-2" :modelValue="false" />
      </div>
    </div>
  </div>

  <div
    class="mt-4 rounded-md border border-gray-200 bg-gray-50 p-2 text-sm text-gray-600"
  >
    <h2 class="pt-0.5 leading-8 font-bold sm:text-lg">任务模型</h2>
    <p>你可以选择作为日常任务的模型</p>

    <div class="flex flex-col gap-1.5">
      <div class="flex justify-between">
        <div class="mt-2 flex min-w-[100px] gap-1 leading-[30px]">
          LLM服务商
          <x-tooltip text="转换服务商后。你的对话将重新设置模型" position="top"
            ><i-mdi-information-slab-circle class="mt-1.5 block"
          /></x-tooltip>
        </div>
        <x-select
          class="mt-2"
          :selectedValue="webllmProvider"
          @change="setWebllmProvider"
          :options="[
            { id: 'ollama', name: 'ollama' },
            { id: 'groq', name: 'groq' },
            // { id: 'webllm', name: 'WebLLM' },
          ]"
        />
      </div>
    </div>

    <div class="flex flex-col gap-1.5">
      <div class="flex justify-between">
        <div class="mt-2 min-w-[100px] leading-[30px]">日常语言模型</div>
        <!-- <x-select
          class="mt-2"
          :options="[
            { id: 'light', name: 'Light' },
            { id: 'dark', name: 'Dark' },
          ]"
          selectedValue="light"
        /> -->
      </div>
    </div>

    <div class="flex flex-col gap-1.5">
      <div class="flex justify-between">
        <div class="mt-2 min-w-[100px] leading-[30px]">向量模型</div>
        <!-- <x-select
          class="mt-2"
          :options="[
            { id: 'light', name: 'Light' },
            { id: 'dark', name: 'Dark' },
          ]"
          selectedValue="light"
        /> -->
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import cachePlugin from "@/plugins/cachePlugin";
import { ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();

const webllmProvider = ref("");

const setWebllmProvider = async (provider) => {
  await cachePlugin.setCurrentProvider(provider);
  webllmProvider.value = provider;
};

const toAbout = () => {
  router.push("settings/about");
};

const init = async () => {
  const webllmProvider = await cachePlugin.getCurrentProvider();
  return {
    webllmProvider,
  };
};
init().then((ctx) => {
  const {} = ctx;
  console.log(ctx);
  webllmProvider.value = ctx.webllmProvider;
});

const removeCache = () => {
  cachePlugin.clearAllCache();
};
</script>
