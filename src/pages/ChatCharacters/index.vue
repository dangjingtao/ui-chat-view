<template>
  <x-subpage-wrapper
    :title="t('title')"
    :isFullWidth="props.isFullWidth"
    @onClose="props.onClose"
  >
    <template #content>
      <div class="flex h-full flex-col">
        <div class="w-full py-2">
          <x-input
            type="search"
            :placeholder="t('searchPlaceholder')"
            @onSearch="onSearch"
            @onClear="onClear"
          />
        </div>
        <x-result
          type="404"
          v-if="characters.length === 0"
          :text="t('noResults')"
        />
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
                {{ t("applyButton") }}
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
import { searchCharacter } from "@/lib/searchCharacter";
import copy from "@/lib/textProcessor/copy";
import { useChatStore } from "@/store/chat";
import { loadModuleTranslations, useNamespace } from "@/i18n";
loadModuleTranslations("pages/ChatCharacters");
const { t } = useNamespace("ChatCharacters");

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
