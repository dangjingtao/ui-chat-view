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
          class="h-full w-[33vw] max-w-110 min-w-95 overflow-hidden shadow-md"
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
      <div class="relative m-auto flex h-full w-full flex-col">
        <div>
          <x-spin v-if="loading" class="pt-50" />

          <chat-start
            class="mx-auto max-w-[800px]"
            v-if="chatStore.defaultCtx.conversation === null && !loading"
          />
        </div>
        <div
          v-if="chatStore.defaultCtx.conversation !== null && !loading"
          ref="chatContainer"
          class="m-auto w-full flex-1 overflow-y-auto"
        >
          <!-- 聊天框全局信息 -->
          <div class="absolute w-full">
            <x-message
              v-for="(globalInfo, index) in chatStore.globalInfoList"
              :key="index"
              :type="globalInfo.type"
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
            @regenarate="regenerate"
            @deleteMessage="deleteMessage"
          />
        </div>

        <div
          v-if="chatStore.defaultCtx.conversation !== null && !loading"
          class="relative h-[100px]"
        >
          <x-sender
            :character="chatStore.defaultCtx?.character"
            :onSend="onSend"
            @onStop="onStopSend"
            :canSend="!chatStore.hasError && !!chatStore.defaultCtx?.model"
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
                text="🪄 高级"
              />
              <x-clickable-tag text="🌐 联网" />
            </template>
          </x-sender>
        </div>
      </div>
    </div>
    <chat-drawer />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, computed, onMounted } from "vue";
import { useChatStore } from "@/store/chat";
import ChatHeader from "./components/ChatHeader.vue";
import ChatDrawer from "./components/ChatDrawer.vue";
import ChatStart from "./components/ChatStart.vue";

import { loadModuleTranslations } from "@/i18n";
loadModuleTranslations("pages/ChatView");

const loading = ref(true);

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
  onOpenCharactersSidebar,
  onOpenConversationAdvanceSettingSidebar,
  clearCharacter,
  onStopSend,
} = chatStore.$service;

onMounted(async () => {
  await init();
  loading.value = false;
});

const currentCharacter = computed(() => {
  return chatStore.defaultCtx?.character?.zh?.title || "🧑‍💻 角色卡";
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
  () => chatStore.chatCtx,
  async (newChatContext) => {
    try {
      if (chat && typeof (chat as any).use === "function") {
        await (chat as any).use(newChatContext.conversation).init();
      } else {
        console.error("chat.use is not a function");
      }
    } catch (error) {
      // @ts-ignore
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
