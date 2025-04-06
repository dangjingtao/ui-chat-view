<script lang="ts" setup>
import { defineProps } from "vue";

// 定义组件的 props
defineProps<{
  text?: string; // 可选的文字内容
}>();
</script>

<template>
  <div class="flex w-full items-center">
    <!-- 左侧线条 -->
    <div class="flex-grow border-t border-gray-300"></div>
    <!-- 中间文字或插槽 -->
    <div v-if="text || $slots.default" class="px-4 text-sm text-gray-500">
      <slot>{{ text }}</slot>
    </div>
    <!-- 右侧线条 -->
    <div class="flex-grow border-t border-gray-300"></div>
  </div>
</template>

<style scoped>
/* 可根据需要添加额外样式 */
</style>
