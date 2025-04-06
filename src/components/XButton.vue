<template>
  <button :class="buttonClass" @click="handleClick">
    <div v-if="props.loading" class="loading-spinner flex w-full items-center">
      <svg class="spinner m-auto" viewBox="0 0 50 50">
        <circle
          class="path"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke-width="4"
        ></circle>
      </svg>
    </div>
    <slot v-else></slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { twMerge } from "tailwind-merge";

const props = defineProps<{
  round?: boolean;
  type?: "primarily" | "ghost" | "text" | "base" | "danger";
  size?: "small" | "default" | "large";
  disabled?: boolean;
  class?: string;
  loading?: boolean;
}>();

const emits = defineEmits(["click"]);

const handleClick = (event: Event) => {
  event.stopPropagation(); // 阻止事件冒泡
  if (!props.disabled || props.loading) {
    emits("click", event);
  }
};

const buttonClass = computed(() => {
  const typeMap = {
    base: "bg-white text-bg-gray-600 hover:border-primary hover:text-primary dark:text-primary-8 border border-gray-200",
    primarily: "bg-primary-6 text-slate-50 hover:bg-primary-7 ",
    ghost:
      "bg-transparent border border-primary-6 text-primary-6 hover:bg-primary-1",
    text: "bg-transparent text-primary-6 hover:bg-primary-1",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  const sizeMap = {
    small: "px-2 py-1 text-xs",
    default: "px-3 py-1.5 text-sm",
    large: "px-4.5 py-2 text-md",
  };

  const classResult = [
    "text-center leading-normal transition-colors duration-100 ease-in-out cursor-pointer focus:outline-primary",
    props.round ? "rounded-full" : "rounded-md",
    sizeMap[props.size || "default"],
    typeMap[props.type || "primarily"],
    props.disabled || props.loading ? "opacity-50 cursor-not-allowed" : "",
    props.class,
  ];

  return twMerge(...classResult);
});
</script>

<style scoped>
.spinner {
  animation: rotate 1s linear infinite;
  width: 1em;
  height: 1em;
}

.path {
  stroke: currentColor;
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}
</style>
