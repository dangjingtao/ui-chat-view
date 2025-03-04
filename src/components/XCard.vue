<template>
  <div
    class="flex max-h-[236px] flex-col overflow-visible rounded border border-gray-200"
  >
    <img v-if="!!image" class="w-full" :src="image" :alt="title" />
    <div class="px-6 py-4">
      <div class="text-md mb-2 font-bold text-gray-700">
        {{ title }}
        <x-tag v-for="tag in tags" :key="tag" :text="tag" class="m-1" />
        <slot v-if="!title" name="header"></slot>
      </div>
      <p
        class="max-h-[40px] overflow-hidden text-sm text-gray-700"
        :class="{ 'line-clamp': true }"
        :title="description"
      >
        {{ description }}
      </p>
    </div>
    <div class="mt-auto flex gap-1 px-6 pb-2">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

defineProps({
  title: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  tags: {
    type: Array as () => string[],
    default: () => [],
  },
});
</script>

<style scoped>
.line-clamp {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 5; /* 设置显示的行数 */
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
