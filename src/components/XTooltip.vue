<template>
  <div
    @mouseenter="showTooltip"
    @mouseleave="hideTooltip"
    class="relative"
    ref="parent"
  >
    <slot></slot>
    <div
      v-if="visible"
      :class="{
        'fixed z-50 max-w-[300px] rounded bg-gray-800 p-2 text-sm break-words text-white opacity-[70%] shadow-lg': true,
      }"
      ref="tooltip"
      :style="tooltipStyle"
    >
      <div class="relative">
        <div
          :class="{
            'absolute transform text-gray-700': true,
            'top-[-8px] left-1/2 -translate-x-1/2 -translate-y-full':
              position === 'bottom',
            'top-1/2 right-[-5px] translate-x-full -translate-y-1/2 rotate-90':
              position === 'left',
            'bottom-[-8px] left-1/2 -translate-x-1/2 translate-y-full -rotate-180':
              position === 'top',
            'top-1/2 left-[-5px] -translate-x-full -translate-y-1/2 -rotate-90':
              position === 'right',
          }"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 10 5"
            width="10"
            height="5"
          >
            <polygon points="0,5 5,0 10,5" fill="currentColor" />
          </svg>
        </div>

        {{ text }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from "vue";

const props = defineProps<{
  text: string;
  position?: "top" | "bottom" | "left" | "right";
  width?: string | number;
}>();

const position = computed(() => props.position || "bottom");

const visible = ref(false);
const tooltip = ref(null);
const parent = ref(null);
const tooltipStyle = ref({});

const showTooltip = () => {
  visible.value = true;
  nextTick(() => {
    updateTooltipPosition();
  });
};

const hideTooltip = () => {
  visible.value = false;
};

const updateTooltipPosition = () => {
  if (!tooltip.value || !parent.value) return;

  const tooltipEl = tooltip.value as HTMLElement;
  const parentEl = parent.value as HTMLElement;
  const parentRect = parentEl.getBoundingClientRect();
  const tooltipRect = tooltipEl.getBoundingClientRect();

  let top = 0;
  let left = 0;

  switch (props.position) {
    case "top":
      top = parentRect.top - tooltipRect.height - 8;
      left = parentRect.left + parentRect.width / 2 - tooltipRect.width / 2;
      break;
    case "bottom":
      top = parentRect.bottom + 8;
      left = parentRect.left + parentRect.width / 2 - tooltipRect.width / 2;
      break;
    case "left":
      top = parentRect.top + parentRect.height / 2 - tooltipRect.height / 2;
      left = parentRect.left - tooltipRect.width - 8;
      break;
    case "right":
      top = parentRect.top + parentRect.height / 2 - tooltipRect.height / 2;
      left = parentRect.right + 8;
      break;
    default:
      top = parentRect.bottom + 8;
      left = parentRect.left + parentRect.width / 2 - tooltipRect.width / 2;
      break;
  }

  // Ensure tooltip does not exceed screen boundaries
  if (left < 0) left = 8;
  if (left + tooltipRect.width > window.innerWidth)
    left = window.innerWidth - tooltipRect.width - 8;
  if (top < 0) top = 8;
  if (top + tooltipRect.height > window.innerHeight)
    top = window.innerHeight - tooltipRect.height - 8;

  tooltipStyle.value = {
    top: `${top}px`,
    left: `${left}px`,
  };
};

const tooltipClasses = computed(() => {
  return `fixed z-50 p-2 text-sm text-white bg-gray-800 opacity-[80%] rounded shadow-lg w-auto max-w-[${props.width || 120}px] break-words`;
});

onMounted(() => {
  nextTick(() => {
    updateTooltipPosition();
  });
});
</script>
