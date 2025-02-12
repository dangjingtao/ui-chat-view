<template>
  <div class="relative flex h-full w-full flex-col bg-gray-50">
    <Chat-header />

    <div class="flex-1 overflow-y-auto">
      <!-- 这里可以添加聊天内容 -->
      <x-welcome v-if="showChatHistory" />
      <x-chat-view v-if="!showChatHistory" :messages="chatHistory" />
    </div>

    <input-area :onSend="onSend" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import OpenAI from "openai";
import InputArea from "@/blocks/InputArea.vue";
import ChatHeader from "@/blocks/ChatHeader.vue";
import Chat from "@/lib/Chat.ts";

const chat = new Chat();
chat.use("kimi");

const chatHistory = ref([]);

const onSend = async (ctx) => {
  console.log("send", ctx);
  chatHistory.value.push(ctx);

  const reply = await chat.sendMessage(ctx);
  console.log("reply", reply);
  chatHistory.value.push(reply);
};

const showChatHistory = computed(() => {
  return chatHistory.value.length === 0;
});
</script>

<style scoped></style>
