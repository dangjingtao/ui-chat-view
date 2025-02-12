<template>
  <div class="relative flex h-full w-full flex-col bg-gray-50">
    <Chat-header />
    <div ref="chatContainer" class="flex-1 overflow-y-auto">
      <!-- 这里可以添加聊天内容 -->
      <x-welcome v-if="showChatHistory" />
      <x-chat-view v-if="!showChatHistory" :messages="chatHistory" />
    </div>
    <div class="h-[52px]"><input-area :onSend="onSend" /></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from "vue";
import OpenAI from "openai";
import InputArea from "@/blocks/InputArea.vue";
import ChatHeader from "@/blocks/ChatHeader.vue";
import Chat from "@/lib/Chat.ts";

const chat = new Chat();
chat.use("groq");
const chatHistory = ref([]);
const chatContainer = ref(null);

const onSend = async (ctx) => {
  console.log("send", ctx);
  chatHistory.value.push(ctx);
  const reply = await chat.sendMessage(ctx);
  console.log("reply", reply);
  chatHistory.value.push(reply);
};

const showChatHistory = computed(() => chatHistory.value.length === 0);

// 监听 chatHistory 的变化，并在变化时滚动到底部
watch(chatHistory, async () => {
  await nextTick();
  const container = chatContainer.value;
  console.log(container);
  container.scrollTop = container.scrollHeight;
});
</script>
