<template>
  <x-subpage-wrapper
    :title="t('title')"
    :isFullWidth="props.isFullWidth"
    @onClose="props.onClose"
  >
    <template #content>123 </template>
  </x-subpage-wrapper>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import prompts from "@/dataSet/prompts.json";
import { searchCharacter } from "@/lib/searchCharacter";
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
