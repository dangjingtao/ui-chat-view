<template>
  <div class="relative">
    <input
      :type="type"
      v-model="inputValue"
      @input="onInput"
      @keydown.enter="onSearch"
      :placeholder="placeholder"
      class="focus:ring-geekblue-4 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm transition-all focus:ring-2 focus:outline-none"
    />
    <button
      v-if="type === 'search' && !inputValue"
      @click="onSearch"
      class="absolute top-1 right-1 bottom-1 flex w-6 items-center text-gray-500 hover:text-gray-700 focus:outline-none"
    >
      <i-mdi-magnify class="text-base" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps } from "vue";

defineProps({
  type: {
    type: String,
    default: "text",
  },
  placeholder: {
    type: String,
    default: "请输入内容...",
  },
});

const emits = defineEmits(["onSearch", "onInput", "onClear"]);

const onSearch = () => {
  emits("onSearch", inputValue.value);
};

const inputValue = ref("");

const onInput = () => {
  // 处理输入事件
  if (inputValue.value === "") {
    emits("onClear");
  }
  emits("onInput", inputValue.value);
};
</script>

<style scoped>
/* 你可以在这里添加额外的样式 */
</style>
