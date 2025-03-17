<template>
  <x-menu
    v-if="chatStore.conversations.length > 0"
    :selectedItem="chatStore.defaultCtx?.id"
    :menus="chatStore.conversations"
    @deleteMenuItem="onDeleteConversation"
    @changeMenuItem="onChangeConversation"
  />
  <x-result class="pt-20" type="404" v-else />
</template>

<script setup lang="ts">
// 和drawer公用
import { useChatStore } from "@/store/chat";
const chatStore = useChatStore();
const { onChangeConversation, onDeleteConversation } = chatStore.$service;
</script>
