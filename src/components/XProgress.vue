<template>
  <div class="w-full overflow-hidden rounded bg-gray-300">
    <div
      class="bg-primary h-2 rounded-full p-0.5 text-center text-xs leading-none font-medium text-blue-100 transition-all duration-500 ease-in-out"
      :style="{ width: progress + '%' }"
    ></div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  progress: {
    type: Number,
    required: true,
    validator(value) {
      return value >= 0 && value <= 100;
    },
  },
});
</script>

<style scoped>
/* No additional styles needed as Tailwind CSS is used */
</style>
