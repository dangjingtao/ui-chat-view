<template>
  <div
    v-if="chatStore.defaultCtx.conversation !== null && !chatStore.pageLoading"
    ref="chatContainer"
    class="m-auto w-full flex-1 overflow-y-auto"
  >
    <!-- 聊天框全局信息 -->
    <div class="absolute w-full">
      <x-message
        v-for="(globalInfo, index) in chatStore.globalInfoList"
        :key="index"
        :type="globalInfo.type"
        :dismissible="true"
        @close="removeGlobalInfo(index)"
      >
        <template #default>
          <p class="text-center">{{ globalInfo.content }}</p>
        </template>
      </x-message>
    </div>

    <x-welcome v-if="chatStore.isEmptyConversation" />

    <x-chat-view
      v-else
      :isSending="chatStore.isSending"
      :messages="chatStore.chatHistory"
      @regenerate="regenerate"
      @deleteMessage="deleteMessage"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import { useChatStore } from "@/store/chat";
// import { loadModuleTranslations, useNamespace } from "@/i18n";
// loadModuleTranslations("pages/ChatView");

const chatContainer = ref<HTMLElement | null>(null);
const chatStore = useChatStore();
const { regenerate, deleteMessage, removeGlobalInfo } = chatStore.$service;

watch(
  () => chatStore.chatHistory,
  async () => {
    await nextTick();
    const container = chatContainer.value;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  },
  { deep: true },
);
</script>
