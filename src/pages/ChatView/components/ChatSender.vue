<template>
  <div
    v-if="chatStore.defaultCtx.conversation !== null && !chatStore.pageLoading"
    class="relative h-[110px] md:h-[126px]"
  >
    <x-sender
      :character="chatStore.defaultCtx?.character"
      :onSend="onSend"
      @onStop="onStopSend"
      :canSend="!chatStore.hasError"
      :isSending="chatStore.isSending"
    >
      <template #functionsGroup>
        <x-clickable-tag
          :closable="true"
          @click="onOpenCharactersSidebar"
          @close="clearCharacter"
          :text="currentCharacter"
          :isActived="!!chatStore.defaultCtx?.character"
        />
        <x-clickable-tag
          @click="onOpenConversationAdvanceSettingSidebar"
          :text="t('advanced')"
        />
      </template>
    </x-sender>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useChatStore } from "@/store/chat";
import { loadModuleTranslations, useNamespace } from "@/i18n";
loadModuleTranslations("pages/ChatView");
const { t } = useNamespace("ChatView.ChatSender");

const chatStore = useChatStore();
const {
  onSend,
  onOpenCharactersSidebar,
  onOpenConversationAdvanceSettingSidebar,
  clearCharacter,
  onStopSend,
} = chatStore.$service;

const currentCharacter = computed(() => {
  return chatStore.defaultCtx?.character?.zh?.title || t("characterCard");
});
</script>
