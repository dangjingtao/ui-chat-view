<template>
  <div class="flex min-h-full justify-center">
    <div class="m-auto flex items-center space-x-2">
      <div
        class="h-8 w-8 animate-spin rounded-full border-4 border-t-4 border-gray-200"
      ></div>
      <span class="text-sm text-gray-700">加载中...</span>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style scoped>
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
