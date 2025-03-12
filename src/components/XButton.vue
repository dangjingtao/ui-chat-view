<template>
  <button :class="buttonClass" @click="handleClick">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { defineEmits, computed } from "vue";
import { twMerge } from "tailwind-merge";

const props = defineProps<{
  round?: boolean;
  type?: "primarily" | "ghost" | "text";
  size?: "small" | "default" | "large";
  disabled?: boolean;
  class?: string;
}>();

const emits = defineEmits(["click"]);

const handleClick = (event: Event) => {
  if (!props.disabled) {
    emits("click", event);
  }
};

const buttonClass = computed(() => {
  const typeMap = {
    primarily: "bg-primary-6 text-white hover:bg-primary-7",
    ghost:
      "bg-transparent border border-primary-6 text-primary-6 hover:bg-primary-1",
    text: "bg-transparent text-primary-6 hover:bg-primary-1",
  };

  const sizeMap = {
    small: "px-2 py-1 text-xs",
    default: "px-3 py-1.5 text-sm",
    large: "px-4.5 py-2 text-md",
  };

  const classResult = [
    "text-center leading-normal transition-colors duration-100 ease-in-out cursor-pointer",
    props.round ? "rounded-full" : "rounded-md",
    sizeMap[props.size || "default"],
    typeMap[props.type || "primarily"],
    props.disabled ? "opacity-50 cursor-not-allowed" : "",
    props.class,
  ];

  return twMerge(...classResult);
});
</script>
