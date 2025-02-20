<template>
  <div class="relative flex h-full w-full flex-col bg-gray-50">
    <Chat-header
      :models="models"
      :currentModel="defaultCtx?.model ?? ''"
      :selectedConversation="selectedConversation"
      :onSelectModel="onSelectModel"
      :onAddConversation="onAddConversation"
      :conversations="chatCtx?.conversations ?? []"
      :onDeleteConversation="onDeleteConversation"
      :onChangeConversation="onChangeConversation"
    />

    <div ref="chatContainer" class="m-auto w-full flex-1 overflow-y-auto">
      <!-- 全局信息 -->
      <x-message
        v-for="(globalInfo, index) in globalInfoList"
        :key="index"
        :type="globalInfo.type"
        dismissible
      >
        <template #default>
          <p class="text-center">{{ globalInfo.content }}</p>
        </template>
      </x-message>

      <!-- 这里可以添加聊天内容 -->
      <x-welcome v-if="showChatHistory" />

      <x-chat-view v-if="!showChatHistory" :messages="chatHistory" />
    </div>
    <div class="h-[120px]">
      <input-area
        :onSend="onSend"
        :canSend="!hasError"
        :isSending="isSending"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from "vue";
import clientCache, { ChatContext, ChatMessage } from "@/plugins/cachePlugin";
import request from "@/lib/request";
import InputArea from "@/blocks/InputArea.vue";
import ChatHeader from "@/blocks/ChatHeader.vue";
import Chat from "@/lib/Chat.ts";
import { Message } from "@/components/XMessage.vue";

const chatContainer = ref<HTMLElement | null>(null);

const chatCtx = ref<ChatContext | null>({
  model: "",
  provider: "",
  conversation: null,
  URLs: {
    models: "",
  },
  systemPrompt: "",
});

const isSending = ref(false);
const models = ref<string[]>([]);
const globalInfoList = ref<Message[]>([]);

const chat = new Chat();

const hasError = computed(() =>
  globalInfoList.value.find((x) => x.type === "danger"),
);
const showChatHistory = computed(() => chatHistory.value.length === 0);

const selectedConversation = computed(() => {
  return chatCtx.value?.conversation?.id;
});

const defaultCtx = computed(() => {
  const { conversation } = chatCtx.value || {};
  const ctx = conversation || chatCtx.value;
  return ctx;
});

const chatHistory = computed(() => {
  const { conversation } = chatCtx.value || {};
  return conversation?.chatHistory || [];
});

const handleInitError = (e) => {
  const errorMessage: string = (e as any)?.message || "Unknown error";
  globalInfoList.value.push({
    code: (e as any)?.data?.code || "500",
    content: errorMessage,
    type: "danger",
  });
};

//!
const init = async () => {
  const chatContext = await clientCache.getChatContext();
  chatCtx.value = chatContext;
  try {
    const URLs = chatCtx.value?.URLs || { models: "" };
    // 请求models成功后再初始化
    const { data } = await request({ url: URLs.models, method: "GET" });
    models.value = data.map((x) => ({ id: x.id, name: x.id }));
  } catch (e) {
    handleInitError(e);
  }
};

init();

const onSelectModel = async (id) => {
  const currenConversation = await clientCache.getCurrentConversation();
  if (currenConversation) {
    const newConversation = await clientCache.updateConversationModel(id);

    chatCtx.value = {
      ...chatCtx.value,
      conversation: newConversation,
    };
  } else {
    chatCtx.value = {
      ...chatCtx.value,
      model: id,
    };
  }
  const filteredList = globalInfoList.value.filter((x) => x.code !== "model");
  globalInfoList.value = filteredList;
};

const addMessageToHistory = async (message: ChatMessage) => {
  const { id, stream } = message;
  let chunks = "";

  if (!stream) {
    const updatedConversation =
      await clientCache.addMessageToCurrenConversationHistory(message);

    chatCtx.value = {
      ...chatCtx.value,
      conversation: updatedConversation,
    };
  } else {
    for await (const chunk of stream) {
      chunks += chunk;
      const chatHistory = chatCtx.value.conversation.chatHistory;
      const updatedIndex = chatHistory.findIndex((x) => x.id === id);
      if (updatedIndex !== -1) {
        chatHistory[updatedIndex].content = chunks;
      } else {
        chatHistory.push({ ...message, content: chunks });
      }
    }
    delete message.stream;
    await clientCache.addMessageToCurrenConversationHistory({
      ...message,
      content: chunks,
    });
  }
};

const onAddConversation = async () => {
  const { model, provider, URLs, apiKey, systemPrompt } = chatCtx.value;
  const newConversation = {
    title: "New Conversation",
    model,
    provider,
    URLs,
    apiKey,
    systemPrompt,
  };

  // 设置为当前聊天, 更新聊天列表
  const { conversations: newConversations, conversation: updatedConversation } =
    await clientCache.addConversation(newConversation);
  const chatContext = {
    ...chatCtx.value,
    conversation: updatedConversation,
    conversations: newConversations,
  };
  // 前端状态更新
  chatCtx.value = chatContext;

  return await newConversations;
};

const onDeleteConversation = async (conversationId) => {
  const { conversations: newConversations } =
    await clientCache.deleteConversation(conversationId);
  // 需要判断delete的是当前的情况

  chatCtx.value = {
    ...chatCtx.value,
    conversations: newConversations,
  };
};

const onChangeConversation = async (id) => {
  const conversation = await clientCache.setConversation(id);
  const newChatContext = {
    ...chatCtx.value,
    conversation,
  };
  chatCtx.value = newChatContext;
};

const onSend = async (message: ChatMessage) => {
  if (!hasError.value) {
    let currenConversation = await clientCache.getCurrentConversation();
    isSending.value = true;

    if (!currenConversation) {
      currenConversation = await onAddConversation();
    }

    await addMessageToHistory(message);
    const reply = await chat.sendMessage();
    await addMessageToHistory(reply);
    if (reply.title) {
      // updae conversation title
      const updatedConversations = await clientCache.updateConversationTitle(
        reply.title,
      );
      chatCtx.value = {
        ...chatCtx.value,
        conversations: updatedConversations,
      };
    }
    isSending.value = false;
  }
};

watch(
  chatHistory,
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
  defaultCtx,
  async (newChatContext, oldChatContext) => {
    try {
      await chat.use(newChatContext).init();
    } catch (error) {
      handleInitError(error);
    }
  },
  { deep: true },
);
</script>
