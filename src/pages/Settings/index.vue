<template>
  <div
    class="relative m-auto flex h-full min-h-[400px] w-full flex-col bg-white px-3 sm:mt-1 sm:px-5 md:w-[80%]"
  >
    <x-button type="text" class="absolute top-1 right-0" @click="goBack">
      <i-mdi-close class="text-bold text-xl text-gray-800" />
    </x-button>
    <div class="flex pt-8 pb-6 sm:pt-10">
      <img :src="logo" class="w-30" alt="UI Chat" srcset="" />&nbsp;
      <span class="text-geekblue-5 self-end leading-2 font-bold"
        >v{{ version }}</span
      >
    </div>
    <div class="flex-1 overflow-auto">
      <system-setting />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useRouter } from "vue-router";
import logo from "@/assets/logo.png";
import SystemSetting from "@/blocks/SystemSetting.vue";

declare const __APP_VERSION__: string;
const version = __APP_VERSION__;

const router = useRouter();

const goBack = () => {
  router.go(-1);
};
</script>
<style scoped></style>
