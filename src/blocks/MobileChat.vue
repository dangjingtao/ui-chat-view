<template>
  <div class="relative flex h-full w-full flex-col bg-gray-50">
    <Chat-header :models="models" />
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
import { useCache } from "@/plugins/cachePlugin";
import InputArea from "@/blocks/InputArea.vue";
import ChatHeader from "@/blocks/ChatHeader.vue";
import Chat from "@/lib/Chat.ts";

const clientCache = useCache();
const chat = new Chat();
const models = ref([]);
const chatHistory = ref([]);
const chatContainer = ref(null);

clientCache.getCurrentModelContext().then((chatContext) => {
  console.log(chatContext);
  const aaa = {
    ...chatContext,
    model: chatContext.current_model_name,
  };
  chat.use(aaa).init();
  // const openai = new OpenAI(provider.apiKey);
  // chat.use(openai);
});

const onSend = async (ctx) => {
  console.log("send", ctx);
  chatHistory.value.push(ctx);
  const reply = await chat.sendMessage(ctx);
  // console.log("reply", reply);
  chatHistory.value.push(reply);
};

const showChatHistory = computed(() => chatHistory.value.length === 0);

// 监听 chatHistory 的变化，并在变化时滚动到底部
watch(chatHistory, async () => {
  await nextTick();
  const container = chatContainer.value;
  container.scrollTop = container.scrollHeight;
});
</script>
