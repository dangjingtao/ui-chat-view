<template>
  <div
    class="flex h-auto flex-col overflow-visible rounded border border-gray-200"
  >
    <img v-if="!!image" class="w-full" :src="image" :alt="title" />
    <div class="text-md px-4 pt-4 pb-1 font-bold text-gray-700 md:px-6">
      {{ title }}
      <x-tag v-for="tag in tags" :key="tag" :text="tag" class="m-1" />
      <slot v-if="!title" name="header"></slot>
    </div>
    <div class="flex-1 overflow-auto px-4 py-1 text-sm text-gray-600 md:px-6">
      <slot name="body"> </slot>
    </div>
    <div class="mt-auto flex gap-1 px-4 py-3">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    required: false,
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
