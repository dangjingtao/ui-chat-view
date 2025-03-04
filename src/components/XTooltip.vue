<template>
  <div
    class="relative flex items-center"
    @mouseenter="showTooltip"
    @mouseleave="hideTooltip"
  >
    <slot></slot>
    <div v-if="visible" :class="tooltipClasses">
      <div :class="arrowClasses"></div>
      {{ text }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const props = defineProps<{
  text: string;
  position?: "top" | "bottom" | "left" | "right";
}>();

const visible = ref(false);

const showTooltip = () => {
  visible.value = true;
};

const hideTooltip = () => {
  visible.value = false;
};

const tooltipClasses = computed(() => {
  const baseClasses =
    "absolute z-10 p-2 text-sm text-white bg-gray-800 opacity-[80%] rounded shadow-lg whitespace-nowrap";
  let positionClasses = "";
  switch (props.position) {
    case "top":
      positionClasses = "bottom-full left-1/2 transform -translate-x-1/2 mb-2";
      break;
    case "bottom":
      positionClasses = "top-full left-1/2 transform -translate-x-1/2 mt-2";
      break;
    case "left":
      positionClasses = "right-full top-1/2 transform -translate-y-1/2 mr-2";
      break;
    case "right":
      positionClasses = "left-full top-1/2 transform -translate-y-1/2 ml-2";
      break;
    default:
      positionClasses = "top-full left-1/2 transform -translate-x-1/2 mt-2";
      break;
  }
  return `${baseClasses} ${positionClasses}`;
});

const arrowClasses = computed(() => {
  const baseArrowClasses = "absolute w-0 h-0 border-transparent";
  let positionArrowClasses = "";
  switch (props.position) {
    case "top":
      positionArrowClasses =
        "border-t-gray-800 border-t-8 border-x-8 bottom-[-4px] left-1/2 transform -translate-x-1/2";
      break;
    case "bottom":
      positionArrowClasses =
        "border-b-gray-800 border-b-8 border-x-8 top-[-4px] left-1/2 transform -translate-x-1/2";
      break;
    case "left":
      positionArrowClasses =
        "border-l-gray-800 border-l-8 border-y-8 right-[-4px] top-1/2 transform -translate-y-1/2";
      break;
    case "right":
      positionArrowClasses =
        "border-r-gray-800 border-r-8 border-y-8 left-[-4px] top-1/2 transform -translate-y-1/2";
      break;
    default:
      positionArrowClasses =
        "border-b-gray-800 border-b-8 border-x-8 top-[-4px] left-1/2 transform -translate-x-1/2";
      break;
  }
  return `${baseArrowClasses} ${positionArrowClasses}`;
});
</script>

<style scoped>
/* 在这里添加你的样式 */
</style>
