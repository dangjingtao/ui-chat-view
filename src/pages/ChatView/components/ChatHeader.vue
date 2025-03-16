<template>
  <header
    class="flex h-11 items-center bg-white px-4 py-1.5 text-gray-500 shadow"
  >
    <div class="flex flex-1 font-bold">
      <img :src="logo" class="w-[32px]" alt="UI Chat" srcset="" />
      <!-- <div class="text-3xl leading-8 text-gray-400">UI Chat</div> -->
    </div>

    <div v-if="!!chatStore.chatCtx.conversation">
      <x-select
        dropdownClass="right-[-45px] max-h-[500px] min-w-[400px]"
        :options="chatStore.models"
        @change="onSelectModel"
        :selectedValue="chatStore.defaultCtx?.model"
      />
    </div>
    <x-button
      type="base"
      class="cursor-pointer border-0 px-1 py-1.5 text-gray-500 focus:outline-none"
      @click="toggleDrawer"
    >
      <i-mdi-menu class="text-[1rem]" />
    </x-button>
  </header>
</template>

<script setup lang="ts">
import logo from "@/assets/images/logoIcon-192.png";
import { useChatStore } from "@/store/chat";

const chatStore = useChatStore();
const { onSelectModel, toggleDrawer } = chatStore.$service;
</script>
