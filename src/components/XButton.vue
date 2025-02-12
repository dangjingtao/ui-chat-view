<template>
  <button :class="buttonClass" @click="handleClick">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { defineEmits, computed } from "vue";

const props = defineProps<{
  type?: "primarily" | "ghost";
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
  };

  const sizeMap = {
    small: "px-2 py-1 text-xs",
    default: "px-4 py-2 text-sm",
    large: "px-6 py-3 text-lg",
  };

  return [
    "text-center leading-normal rounded-md transition-colors duration-100 ease-in-out",
    sizeMap[props.size || "default"],
    typeMap[props.type || "primarily"],
    props.disabled ? "opacity-50 cursor-not-allowed" : "",
    props.class,
  ];
});
</script>

<style scoped>
/* 这里可以添加一些额外的样式 */
</style>
