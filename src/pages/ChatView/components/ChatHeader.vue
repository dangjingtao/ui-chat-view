<template>
  <header
    class="flex h-11 items-center justify-between gap-1 bg-white px-4 py-1.5 text-gray-500 shadow"
  >
    <div class="text-primary-7 flex-1 font-bold">
      <img :src="logo" class="w-[80px]" alt="UI Chat" srcset="" />
    </div>
    <div>
      <x-select
        dropdownClass="right-[-45px] max-h-[500px] min-w-[400px]"
        :options="chatStore.models"
        @change="onSelectModel"
        :selectedValue="chatStore.defaultCtx?.model"
      />
    </div>
    <button
      class="px-1 py-1.5 text-gray-500 focus:outline-none"
      @click="toggleDrawer"
    >
      <i-mdi-menu class="text-[1rem]" />
    </button>
  </header>
</template>

<script setup lang="ts">
import logo from "@/assets/logo.png";
import { useChatStore } from "@/store/chat";

const chatStore = useChatStore();
const { onSelectModel, toggleDrawer } = chatStore.$service;
</script>
