<template>
  <div class="relative">
    <input
      :disabled="disabled"
      :type="type"
      v-model="inputValue"
      @input="onInput"
      @keydown.enter="onSearch"
      :placeholder="placeholder"
      :class="{
        'cursor-not-allowed': disabled,
        'bg-gray-200': disabled,
        'text-gray-400': disabled,
        'hover:bg-gray-50': !disabled,
      }"
      class="focus:outline-primary-4 w-full rounded-md border border-gray-200 bg-gray-100 px-2 py-1.5 text-sm placeholder-gray-400 transition-all focus:bg-white dark:text-gray-600 dark:placeholder-gray-500"
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
defineProps({
  type: {
    type: String,
    default: "text",
  },
  placeholder: {
    type: String,
    default: "请输入内容...",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const inputValue = defineModel<string>();

const emits = defineEmits(["onSearch", "onInput", "onClear"]);

const onSearch = () => {
  emits("onSearch", inputValue.value);
};

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
