<template>
  <div
    class="relative m-auto h-full min-h-[400px] w-full bg-white px-3 sm:mt-1 sm:w-[80%] sm:px-5"
  >
    <x-button type="text" class="absolute top-1 right-0" @click="goBack">
      <i-mdi-close class="text-bold text-xl text-gray-800" />
    </x-button>
    <div class="flex pt-8 sm:pt-10">
      <img :src="logo" class="w-30" alt="UI Chat" srcset="" />&nbsp;
      <span class="text-geekblue-5 self-end leading-2 font-bold">v0.0.1</span>
    </div>
    <XTab :tabs="['System', 'Charactors']">
      <template #tab-0>
        <system-setting />
      </template>
      <template #tab-1>
        <p>这是第二个标签页的内容。</p>
      </template>
    </XTab>
  </div>
</template>
<script lang="ts" setup>
import { useRouter } from "vue-router";
import logo from "@/assets/logo.png";
import SystemSetting from "@/blocks/SystemSetting.vue";

const router = useRouter();

const goBack = () => {
  router.go(-1);
};
</script>
