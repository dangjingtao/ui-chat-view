<template>
  <div class="flex h-full flex-col">
    <div class="px-2">
      <x-button
        type="ghost"
        class="mb-4 w-full text-sm"
        size="small"
        @click="onAddConversation"
      >
        {{ t("newConversation") }}
      </x-button>
    </div>
    <div class="flex-1 overflow-auto">
      <conversations-menu />
    </div>
    <div class="flex flex-row items-center border-t border-slate-300">
      <chat-entrance :isPC="true" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useChatStore } from "@/store/chat";
import ConversationsMenu from "./ConversationsMenu.vue";
import ChatEntrance from "./ChatEntrance.vue";
import { useNamespace } from "@/i18n";

const { t } = useNamespace("ChatView.ChatEntrance");

const chatStore = useChatStore();
const { onAddConversation } = chatStore.$service;
</script>
