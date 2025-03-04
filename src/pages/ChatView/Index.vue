<template>
  <div class="relative flex h-full w-full flex-col gap-0.5 bg-gray-50">
    <chat-header />
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
          >
            <template #functionsGroup>
              <x-clickable-tag
                :closable="true"
                @click="onOpenCharactors"
                @close="clearCharactor"
                :text="charactorUsed"
                :isActived="!!chatStore.defaultCtx?.charactor"
              />
              <x-clickable-tag text="🌐 联网搜索" />
            </template>
          </x-sender>
        </div>
      </div>
    </div>
    <chat-drawer />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, computed } from "vue";
import { useChatStore } from "@/store/chat";
import ChatHeader from "./components/ChatHeader.vue";
import ChatDrawer from "./components/ChatDrawer.vue";

const chatContainer = ref<HTMLElement | null>(null);
const chatStore = useChatStore();

const {
  init,
  regenerate,
  deleteMessage,
  onSend,
  closeSideBar,
  chat,
  handleUIError,
  onOpenCharactors,
  clearCharactor,
} = chatStore.$service;

init().then(() => {
  console.log(chatStore.conversationId);
});

const charactorUsed = computed(() => {
  return chatStore.defaultCtx?.charactor?.zh?.title || "🧑‍💻 角色卡";
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
