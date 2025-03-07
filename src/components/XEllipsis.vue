<template>
  <div>
    <div>
      <span
        :style="{
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          overflow: 'hidden',
          'text-overflow': 'ellipsis',
          'white-space': 'normal',
          '-webkit-line-clamp': props.lines,
          'line-clamp': props.lines,
        }"
      >
        <slot name="visible"></slot>
        <button
          v-if="props.isShowExpandButton"
          @click="toggleExpand"
          class="mt-2 text-sm text-blue-500"
        >
          {{ isExpanded ? "收起" : "展开" }}
        </button>
      </span>
    </div>
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
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps({
  lines: {
    type: Number,
    default: 1,
  },
  isShowExpandButton: {
    type: Boolean,
    default: true,
  },
});

const isExpanded = ref(false);

function toggleExpand() {
  isExpanded.value = !isExpanded.value;
}
</script>

<style scoped>
.ellipsis-container {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  -webkit-line-clamp: 3;
  line-clamp: 3;
}
.h-0 {
  height: 0 !important;
}
.h-auto {
  height: auto !important;
}
</style>
