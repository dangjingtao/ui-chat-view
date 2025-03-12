<template>
  <div
    class="flex h-[calc(100vh-400px)] flex-col items-center justify-center bg-gray-50 lg:h-[calc(100vh-400px)]"
  >
    <!-- <x-brand /> -->
    <div class="-ml-5 flex w-[80%] justify-center lg:w-[50%]">
      <div ref="lottieContainer" class="w-[45%]"></div>

      <img class="mt-[20%] block h-fit w-[55%] flex-1" :src="logo" alt="logo" />
    </div>
    <p class="pt-1 pb-5 text-2xl font-semibold text-gray-500">AI 体验新秩序</p>
    <div class="mt-5 flex gap-3">
      <x-button @click="start" size="large">开始体验</x-button>
      <x-button @click="learnMore" type="ghost" size="large">尿解更多</x-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import lottie from "lottie-web";
import { useChatStore } from "@/store/chat";
import json from "./lottie.json";
import logo from "@/assets/logo.png";
const start = () => {
  const chatStore = useChatStore();
  chatStore.$service.onAddConversation();
};

const learnMore = () => {
  window.open("https://github.com/dangjingtao/ui-chat-view");
};

const lottieContainer = ref(null);

onMounted(() => {
  lottie.loadAnimation({
    container: lottieContainer.value as unknown as Element,
    renderer: "svg",
    loop: true,
    autoplay: true,
    animationData: json,
  });
});
</script>
