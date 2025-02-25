<template>
  <div class="flex h-full flex-col">
    <div class="w-full px-1 py-1">
      <x-input type="search" @onSearch="onSearch" @onClear="onClear" />
      <x-ellipsis :lines="2">
        <template #visible>
          <span class="pt-2 text-sm leading-6 text-gray-600">
            {{ introduce.content }}
          </span>
        </template>
        <template #hidden>
          <ul class="list-disc pt-3 pl-5">
            <li class="mb-2" v-for="item in introduce.desc" :key="item.title">
              <div class="flex items-center justify-between">
                <div class="">
                  <strong class="text-sm text-gray-800">{{ item.title }}</strong
                  >&nbsp;
                  <span class="text-sm text-gray-400">{{ item.content }}</span>
                </div>
              </div>
            </li>
          </ul>
        </template>
      </x-ellipsis>
    </div>
    <x-empty v-if="charactors.length === 0" />
    <div class="flex flex-1 flex-wrap gap-3 overflow-auto">
      <x-card
        v-for="{ id, zh, tags } in charactors"
        :key="zh.title"
        :title="zh.title"
        :description="zh.description"
        :tags="tags"
        class="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-0.5rem)]"
      >
        <template #footer>
          <x-button type="ghost" size="small"> 查看详情 </x-button>
          <x-button type="ghost" size="small"> 收藏 </x-button>
          <x-button size="small" @click="() => copy(id)"> 复制指令 </x-button>
        </template>
      </x-card>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import prompts from "@/dataSet/prompts.json";
import introduce from "@/dataSet/charactor_introduce.json";
import { searchCharactor } from "@/lib/searchCharactor";
import message from "@/lib/message";

const copy = async (id) => {
  try {
    const directive = `system_prompt[id=${id}] `;
    await navigator.clipboard.writeText(directive);
    message.success(`${directive} 复制成功。请到聊天界面输入框粘贴使用`);
  } catch (err) {
    message.error(`复制失败: ${err}`);
  }
};

const charactors = ref(prompts);

const onSearch = (value: string) => {
  if (value) {
    console.log("搜索内容:", value);
    const searchResult = searchCharactor(value, prompts);
    charactors.value = searchResult;
  } else {
    onClear();
  }
};

const onClear = () => {
  charactors.value = prompts;
};
</script>
<style scoped></style>
