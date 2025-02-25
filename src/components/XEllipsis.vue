<template>
  <div class="py-3">
    <div :class="{ ellipsis: !isExpanded }">
      <slot name="visible"></slot>
      <button @click="toggleExpand" class="mt-2 text-sm text-blue-500">
        {{ isExpanded ? "收起" : "展开" }}
      </button>
      <transition
        enter-active-class="transition-all duration-100 ease-in-out"
        enter-from-class="h-0 overflow-hidden"
        enter-to-class="h-auto overflow-hidden"
        leave-active-class="transition-all duration-100 ease-in-out"
        leave-from-class="h-auto overflow-hidden"
        leave-to-class="h-0 overflow-hidden"
      >
        <div v-if="isExpanded">
          <slot name="hidden"></slot>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { defineProps } from "vue";

const props = defineProps({
  lines: {
    type: Number,
    default: 1,
  },
});

const isExpanded = ref(false);

function toggleExpand() {
  isExpanded.value = !isExpanded.value;
}
</script>

<style scoped>
.h-0 {
  height: 0 !important;
}
.h-auto {
  height: auto !important;
}
</style>
