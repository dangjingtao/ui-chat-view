<template>
  <x-drawer :menuOpen="chatStore.isDrawerOpen" :toggleMenu="toggleDrawer">
    <template #header>
      <div class="flex items-center gap-2 p-2 pt-0">
        <div class="w-[45%]">
          <!-- <img
            class="block h-[38px]"
            src="https://groq.com/wp-content/uploads/2024/03/PBG-mark1-color.svg"
            src="https://ollama.com/public/ollama.png"
            alt="LLM Provider"
          /> -->
          <img
            class="flex-1"
            src="@/assets/images/STORE.png"
            alt=""
            srcset=""
          />
        </div>
        <div class="mt-1 flex flex-row">
          <x-tooltip text="新对话">
            <x-button
              type="text"
              class="w-full py-2"
              size="small"
              @click="onAddConversation"
            >
              <i-mdi-plus class="text-lg" />
            </x-button>
          </x-tooltip>

          <x-tooltip text="设置">
            <x-button
              type="text"
              class="w-full py-2"
              size="small"
              @click="toSettings"
            >
              <i-mdi-cog-outline class="text-lg" />
            </x-button>
          </x-tooltip>

          <x-tooltip text="知识库">
            <x-button
              type="text"
              class="w-full py-2"
              size="small"
              @click="toKnowledgeHub"
            >
              <i-mdi-bookmark-box-multiple-outline class="text-lg" />
            </x-button>
          </x-tooltip>
        </div>
      </div>
    </template>
    <template #content>
      <x-menu
        :selectedItem="chatStore.defaultCtx?.id"
        :menus="chatStore.conversations"
        @deleteMenuItem="onDeleteConversation"
        @changeMenuItem="onChangeConversation"
      />
    </template>
    <template #footer>
      <div class="flex gap-1">
        <a
          class="flex w-full rounded px-1.5 py-1 transition-colors duration-200 hover:bg-gray-100"
          target="_blank"
          href="https://github.com/dangjingtao/ui-chat-view"
        >
          <i-mdi-github class="text-xl text-gray-600" />&nbsp;<span
            class="text-sm leading-6 text-gray-600"
          >
            &copy; Tomz Dang (tomz.io)
          </span>
        </a>
      </div>
    </template>
  </x-drawer>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useChatStore } from "@/store/chat";

const chatStore = useChatStore();
const {
  onChangeConversation,
  onAddConversation,
  onDeleteConversation,
  toggleDrawer,
} = chatStore.$service;

const router = useRouter();

const toSettings = () => {
  router.push("/settings");
};

const toKnowledgeHub = () => {
  router.push("/knowledge-hub");
};
</script>
