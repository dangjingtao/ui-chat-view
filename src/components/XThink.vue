<template>
  <div class="pt-2 pb-2">
    <div
      class="flex w-20 cursor-pointer items-center justify-between rounded-md bg-gray-100 p-2"
      @click="togglePanel"
    >
      <span class="text-sm font-bold text-gray-600 italic">Think</span>
      <svg
        :class="[
          'h-3 w-3 transition-transform duration-100',
          { 'rotate-180': isOpen },
        ]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        ></path>
      </svg>
    </div>
    <transition
      name="expand"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
    >
      <div
        v-show="isOpen"
        ref="content"
        class="mt-2 mb-3 border-l-3 border-gray-200 pl-2"
      >
        <p
          v-for="(content, index) in thinkContents"
          :key="index"
          class="text-sm text-gray-500"
        >
          {{ content }}
        </p>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { extractThinkContent } from "@/lib/Chat";

const props = defineProps<{ text: string }>();
const thinkContents = ref<string[]>([]);
const isOpen = ref(false);
const content = ref<HTMLElement | null>(null);

const togglePanel = () => {
  isOpen.value = !isOpen.value;
};

const enter = (el: Element) => {
  const element = el as HTMLElement;
  element.style.height = "0";
  element.style.overflow = "hidden";
  element.scrollHeight; // 强制重绘
  element.style.height = `${element.scrollHeight}px`;
};

const afterEnter = (el: Element) => {
  const element = el as HTMLElement;
  element.style.height = "auto";
  element.style.overflow = "visible";
};

const leave = (el: Element) => {
  const element = el as HTMLElement;
  element.style.height = `${element.scrollHeight}px`;
  element.scrollHeight; // 强制重绘
  element.style.height = "0";
  element.style.overflow = "hidden";
};

watch(
  () => props.text,
  (newText) => {
    thinkContents.value = extractThinkContent(newText);
  },
  { immediate: true },
);
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: height 0.2s ease;
}
</style>
