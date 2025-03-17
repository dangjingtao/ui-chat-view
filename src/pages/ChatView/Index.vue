<template>
  <div class="relative flex h-full w-full flex-col bg-gray-100">
    <chat-header />
    <!-- <div class="h-16 bg-white"></div> -->

    <div
      class="flex h-[calc(100%-44px)] w-full flex-1 transition-all md:h-[calc(100%-64px)]"
    >
      <div
        class="m-auto flex h-full w-full bg-gray-50 transition-all md:w-[1440px]"
      >
        <div
          class="hidden h-full w-[240px] bg-gray-100 px-2 py-5 pb-2 md:block"
        >
          <PCMenuBar />
        </div>

        <!-- 主界面 -->
        <div
          class="relative flex h-full w-full flex-1 flex-col transition-all duration-300 ease-in-out"
        >
          <x-spin v-if="loading" class="pt-50" />

          <chat-start
            class="mx-auto max-w-[600px]"
            v-if="chatStore.defaultCtx.conversation === null && !loading"
          />

          <chat-body />

          <chat-sender />
        </div>

        <!-- 动态加载的侧边栏 -->
        <transition
          mode="out-in"
          enter-active-class="transition-all duration-100 ease-in-out"
          leave-active-class="transition-all duration-100 ease-in-out"
        >
          <div
            v-if="chatStore.isSideBarOpen"
            class="h-full w-[360px] overflow-hidden"
          >
            <component
              :onClose="closeSideBar"
              :isFullWidth="true"
              :is="chatStore.currentComponent"
              v-if="chatStore.currentComponent"
            />
          </div>
        </transition>
      </div>
    </div>
    <chat-drawer />
  </div>
</template>

<script setup lang="ts">
import { watch, onMounted } from "vue";
import { useChatStore } from "@/store/chat";
import ChatHeader from "./components/ChatHeader.vue";
import ChatDrawer from "./components/ChatDrawer.vue";
import ChatStart from "./components/ChatStart.vue";
import PCMenuBar from "./components/PCMenuBar.vue";
import ChatSender from "./components/ChatSender.vue";
import ChatBody from "./components/ChatBody.vue";

import { loadModuleTranslations } from "@/i18n";

loadModuleTranslations("pages/ChatView");

const chatStore = useChatStore();
const { init, closeSideBar, chat, handleUIError } = chatStore.$service;

onMounted(async () => {
  await init();
});

watch(
  () => chatStore.defaultCtx,
  async (newChatContext) => {
    try {
      if (chat && typeof (chat as any).use === "function") {
        await (chat as any).use(newChatContext).init();
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
  opacity: 100;
  transition: transform 0.2s ease-in-out;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
  /* transform: translateX(-1000%); */
}
</style>
