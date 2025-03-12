<template>
  <div class="m-auto flex h-full flex-col items-center">
    <div class="relative w-[60%] text-center">
      <img :src="image" alt="No Result" />
    </div>
    <div class="mx-auto w-full text-center md:bottom-25">
      <h2 class="text-2xl font-bold text-gray-500">{{ props.title }}</h2>
      <p>{{ props.description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import notfound from "@/assets/illustrators/notfund.svg";
import serverError from "@/assets/illustrators/network.svg";
import networkError from "@/assets/illustrators/networkerror.svg";

const props = defineProps<{
  title?: string;
  type?: "404" | "500" | "warning" | "loading";
  description?: string;
}>();
const images = {
  "404": notfound,
  "500": serverError,
  networkError,
  warning: serverError,
};
const image = computed(() => images[props.type ?? "warning"]);
</script>

<style scoped>
/* 这里可以添加一些样式，如果需要的话 */
</style>
