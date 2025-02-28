<template>
  <div class="relative flex h-full w-full flex-col gap-0.5 bg-gray-50">
    <chat-header
      :models="chatStore.models"
      :currentModel="chatStore.defaultCtx?.model ?? ''"
      :selectedConversation="chatStore.conversationId"
      :conversations="chatStore.conversations"
      :onSelectModel="onSelectModel"
      :onAddConversation="onAddConversation"
      :onDeleteConversation="onDeleteConversation"
      :onChangeConversation="onChangeConversation"
      :onOpenCharactors="onOpenCharactors"
    />
    <div class="flex h-[calc(100lvh-44px)] w-full flex-1">
      <!-- 动态加载的侧边栏 -->
      <transition
        mode="out-in"
        enter-active-class="transition-all duration-300 ease-in-out"
        leave-active-class="transition-all duration-300 ease-in-out"
      >
        <div
          v-if="chatStore.isSideBarOpen"
          class="h-full w-140 overflow-hidden border-r border-r-gray-300"
        >
          <component
            :onClose="closeSideBar"
            :isFullWidth="true"
            :is="chatStore.currentComponent"
            v-if="chatStore.currentComponent"
          />
        </div>
      </transition>

      <!-- 主界面 -->
      <div class="m-auto flex h-full w-full flex-col">
        <div ref="chatContainer" class="m-auto w-full flex-1 overflow-y-auto">
          <!-- 全局信息 -->
          <x-message
            v-for="(globalInfo, index) in chatStore.globalInfoList"
            :key="index"
            :type="globalInfo.type"
            dismissible
          >
            <template #default>
              <p class="text-center">{{ globalInfo.content }}</p>
            </template>
          </x-message>

          <!-- 这里可以添加聊天内容 -->
          <x-welcome v-if="chatStore.isEmptyConversation" />

          <x-chat-view
            v-else
            :messages="chatStore.chatHistory"
            @regenarate="regenerate"
            @deleteMessage="deleteMessage"
          />
        </div>
        <div class="relative h-[100px]">
          <x-sender
            :charactor="chatStore.defaultCtx?.charactor"
            :onSend="onSend"
            :canSend="!chatStore.hasError && !!chatStore.defaultCtx?.model"
            :isSending="chatStore.isSending"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import { useChatStore } from "@/store/homeStore";
import ChatHeader from "@/blocks/ChatHeader.vue";

const chatContainer = ref<HTMLElement | null>(null);
const chatStore = useChatStore();

const {
  init,
  regenerate,
  onChangeConversation,
  onDeleteConversation,
  onAddConversation,
  onSelectModel,
  deleteMessage,
  onSend,
  closeSideBar,
  onOpenCharactors,
  chat,
  handleUIError,
} = chatStore.$service;

init().then(() => {
  console.log(chatStore.conversationId);
});

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

watch(
  () => chatStore.defaultCtx,
  async (newChatContext, oldChatContext) => {
    try {
      await chat.use(newChatContext).init();
    } catch (error) {
      handleUIError(error);
    }
  },
  { deep: true },
);
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: transform 0.2s ease-in-out;
}
.v-enter-from,
.v-leave-to {
  transform: translateX(-100%);
}
</style>
