<template>
  <div
    class="safe-area h-full overflow-hidden"
    :class="{
      'pt-[var(--tw-space-safe-top)]': top,
      'pb-[var(--tw-space-safe-bottom)]': bottom,
      'pl-[var(--tw-space-safe-left)]': left,
      'pr-[var(--tw-space-safe-right)]': right,
    }"
  >
    <slot></slot>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  top: { type: Boolean, default: true },
  bottom: { type: Boolean, default: true },
  left: { type: Boolean, default: false },
  right: { type: Boolean, default: false },
});
</script>
