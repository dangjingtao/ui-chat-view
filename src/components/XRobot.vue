<template>
  <div
    :class="{
      'items-start': !props.inputting,
      'items-end': props.inputting,
    }"
    class="flex w-full gap-2"
  >
    <div class="w-8 min-w-8">
      <img src="@/assets/fmt.webp" alt="" srcset="" />
    </div>

    <div
      v-if="props.inputting"
      class="w-full pb-3 text-left text-xs text-gray-500"
    >
      <svg
        width="24"
        height="6"
        viewBox="0 0 24 6"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
      >
        <circle cx="3" cy="3" r="3">
          <animate
            attributeName="opacity"
            values="0;1;0"
            dur="1s"
            repeatCount="indefinite"
            begin="0.1"
          />
        </circle>
        <circle cx="12" cy="3" r="3">
          <animate
            attributeName="opacity"
            values="0;1;0"
            dur="1s"
            repeatCount="indefinite"
            begin="0.2"
          />
        </circle>
        <circle cx="21" cy="3" r="3">
          <animate
            attributeName="opacity"
            values="0;1;0"
            dur="1s"
            repeatCount="indefinite"
            begin="0.3"
          />
        </circle>
      </svg>
    </div>

    <div
      v-else
      class="inline-block max-w-max flex-auto rounded-lg border border-gray-200 bg-white px-4 py-3"
    >
      <!-- <x-think
        v-if="hasThinkContent(message.content)"
        :text="message.content"
      /> -->
      <x-markdown @render-complete="onRenderComplete" :content="showContent" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import Typed from "typed.js";
const showContent = ref("");
const props = defineProps<{
  inputting: boolean;
  message: string;
}>();
const typed = ref<Typed | null>(null);
const initTyped = () => {
  if (typed.value) {
    typed.value.destroy();
  }
  window.setTimeout(() => {
    typed.value = new Typed(container.value!, {
      strings: [props.message],
      typeSpeed: 10,
      showCursor: false,
    });
  }, 0);
};

const container = ref<HTMLElement | null>(null);
const onRenderComplete = (el: HTMLElement | null) => {
  container.value = el;
  initTyped();
};

watch(
  () => props.message,
  () => {
    if (typed.value) {
      typed.value.destroy();
    }
    showContent.value = "";
  },
);
</script>
