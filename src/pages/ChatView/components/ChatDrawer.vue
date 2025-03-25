<template>
  <x-drawer :menuOpen="chatStore.isDrawerOpen" :toggleMenu="toggleDrawer">
    <template #header>
      <div class="flex items-center gap-2 p-2 pt-0">
        <div class="mt-1 flex flex-row">
          <chat-entrance :isPC="false" />
        </div>
      </div>
    </template>
    <template #content>
      <conversations-menu />
    </template>
    <template #footer> </template>
  </x-drawer>
</template>

<script setup lang="ts">
import ConversationsMenu from "./ConversationsMenu.vue";
import ChatEntrance from "./ChatEntrance.vue";
import { useChatStore } from "@/store/chat";

const chatStore = useChatStore();
const { toggleDrawer } = chatStore.$service;
</script>
