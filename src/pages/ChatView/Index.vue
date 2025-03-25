<template>
  <div class="relative flex h-full w-full flex-col bg-gray-100">
    <chat-header />

    <div
      class="flex h-[calc(100%-44px)] w-full flex-1 transition-all md:h-[calc(100%-56px)]"
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
          class="relative flex h-full flex-1 flex-col transition-all duration-200 ease-in-out"
        >
          <x-spin v-if="chatStore.pageLoading" class="pt-50" />

          <chat-start
            class="mx-auto max-w-[600px]"
            v-if="
              chatStore.defaultCtx.conversation === null &&
              !chatStore.pageLoading
            "
          />

          <chat-body />

          <chat-sender />
        </div>

        <!-- 动态加载的侧边栏 -->
        <transition name="slide-fade">
          <div
            v-show="chatStore.isSideBarOpen"
            class="h-full w-[400px] overflow-hidden"
          >
            <component
              :onClose="closeSideBar"
              :isFullWidth="true"
              :is="chatStore.currentComponent"
              v-show="chatStore.currentComponent"
            />
          </div>
        </transition>
      </div>
    </div>
    <chat-drawer />
  </div>
</template>

<script setup lang="ts">
import _ from "lodash";
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

const genTools = (conversationPluginSettings) => {
  const tools: any[] = [];
  Object.keys(conversationPluginSettings).forEach((key) => {
    if (conversationPluginSettings[key]) {
      if (key === "tavilySearch") {
        tools.push({
          name: "TavilySearch",
          version: "1.0.0",
          props: {
            onCreated: () => {
              console.log("created");
            },
            onSuccess: (data) => {
              console.log("tavily search success", data);
            },
          },
        });
      }
      // if(key === "notion"){
      //   clonedChatContext.tools.push({
      //     name: "Notion",
      //     version: "1.0.0",
      //     props: {
      //       onSuccess: (data) => {
      //         console.log("notion success", data);
      //         const { context } = data;
      //         webBrowserContent.value = context;
      //         webLoading.value = false;
      //       },
      //     },
      //   });
      // }
    }
  });
  return tools;
};

watch(
  () => chatStore.defaultCtx,
  async (newChatContext) => {
    try {
      if (chat && typeof (chat as any).use === "function") {
        const clonedChatContext = _.cloneDeep(newChatContext);
        const { advanceOptions = {} } = newChatContext;
        const { conversationPluginSettings = {} } = advanceOptions;
        clonedChatContext.tools = genTools(conversationPluginSettings);
        await (chat as any).use(clonedChatContext);
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
.slide-fade-enter-active {
  transition: width transform 0.2s;
}

.slide-fade-leave-active {
  transition: width transform 0.2s;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(100px);
  opacity: 0;
}
</style>
