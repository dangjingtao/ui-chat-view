<template>
  <x-subpage-wrapper
    title="角色卡"
    :isFullWidth="props.isFullWidth"
    @onClose="props.onClose"
  >
    <template #content>
      <div class="flex h-full flex-col">
        <div class="min-h-[114px] w-full p-1 shadow">
          <x-input type="search" @onSearch="onSearch" @onClear="onClear" />
          <div class="py-3">
            <x-ellipsis :lines="4">
              <template #visible>
                <span class="pt-2 text-sm leading-6 text-gray-600">
                  {{ introduce.content }}
                </span>
              </template>
              <template #hidden>
                <ul class="list-disc pt-3 pl-5">
                  <li
                    class="mb-2"
                    v-for="item in introduce.desc"
                    :key="item.title"
                  >
                    <div class="flex items-center justify-between">
                      <div class="">
                        <strong class="text-sm text-gray-800">{{
                          item.title
                        }}</strong
                        >&nbsp;
                        <span class="text-sm text-gray-400">{{
                          item.content
                        }}</span>
                      </div>
                    </div>
                  </li>
                </ul>
              </template>
            </x-ellipsis>
          </div>
        </div>
        <x-result type="404" v-if="characters.length === 0" />
        <div class="flex flex-1 flex-wrap gap-3 overflow-auto px-2">
          <div class="mt-1"></div>
          <x-card
            v-for="{ id, zh, tags } in characters"
            :key="zh.title"
            :title="zh.title"
            :tags="tags"
            class="mt-1 h-60 w-full"
          >
            <template #body>
              <x-tooltip width="200" :text="zh.description" position="right">
                <x-ellipsis :is-show-expand-button="false" :lines="5">
                  <template #visible>{{ zh.description }}</template>
                </x-ellipsis>
              </x-tooltip>
            </template>
            <template #footer>
              <x-button type="text" size="small">
                <i-mdi-heart-outline />
              </x-button>
              <x-button
                type="text"
                size="small"
                @click="() => copy(`system_prompt[id=${id}] `)"
              >
                <i-mdi-content-copy />
              </x-button>
              <x-button
                type="ghost"
                size="small"
                @click="() => useCharacter({ id, zh, tags })"
              >
                一键应用
              </x-button>
            </template>
          </x-card>
          <div class="mt-1"></div>
        </div>
      </div>
    </template>
  </x-subpage-wrapper>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import prompts from "@/dataSet/prompts.json";
import introduce from "@/dataSet/character_introduce.json";
import { searchCharacter } from "@/lib/searchCharacter";
import copy from "@/lib/textProcessor/copy";
import { useChatStore } from "@/store/chat";

const chatStore = useChatStore();

const props = defineProps<{
  isFullWidth?: boolean;
  onClose?: () => void;
}>();

const characters = ref(prompts);

const onSearch = (value: string) => {
  if (value) {
    const searchResult = searchCharacter(value, prompts);
    characters.value = searchResult;
  } else {
    onClear();
  }
};

const onClear = () => {
  characters.value = prompts;
};

const { useCharacter } = chatStore.$service;
</script>
<style scoped></style>
