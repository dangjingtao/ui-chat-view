<template>
  <header
    class="flex h-11 border-b border-gray-100 bg-white px-4 text-gray-500 md:h-14"
  >
    <div class="m-auto flex h-full w-full items-center md:w-[1440px]">
      <div class="flex flex-1 font-bold">
        <img
          :src="currentLogo"
          :class="{
            'h-[20px] pl-4': !isSmall,
            'h-[32px]': isSmall,
          }"
          alt="UI Chat"
          srcset=""
        />
      </div>

      <div v-if="!!chatStore.chatCtx.conversation">
        <x-select
          dropdownClass="right-[-50px] w-[100vw] md:w-max md:right-[0px] max-h-[500px] min-w-[400px]"
          :options="chatStore.models"
          @change="onSelectModel"
          :selectedValue="chatStore.defaultCtx?.model"
        />
      </div>
      <x-button
        type="base"
        class="ml-2 block cursor-pointer border-0 px-1 py-1.5 text-gray-500 focus:outline-none md:hidden"
        @click="toggleDrawer"
      >
        <i-mdi-menu class="text-[1rem]" />
      </x-button>
    </div>
  </header>
</template>

<script setup lang="ts">
import logoLarge from "@/assets/logo.png";
import logo from "@/assets/images/logoIcon-192.png";
import { useChatStore } from "@/store/chat";
import { getScreen } from "@/lib/platform";

const { screenSize } = getScreen();
const isSmall = screenSize === "small";
const currentLogo = isSmall ? logo : logoLarge;

const chatStore = useChatStore();
const { onSelectModel, toggleDrawer } = chatStore.$service;
</script>
