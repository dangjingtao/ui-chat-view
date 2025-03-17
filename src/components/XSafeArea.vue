<template>
  <div
    class="overflow-hidden"
    :class="{
      'pt-[var(--tw-space-safe-top)]': top,
      'pb-[var(--tw-space-safe-bottom)]': isIOS ? 20 : bottom,
      'pl-[var(--tw-space-safe-left)]': left,
      'pr-[var(--tw-space-safe-right)]': right,
      'h-[100svh]': isIOS,
      'safe-area': !isIOS,
    }"
  >
    <slot></slot>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import { getOperatingSystem } from "@/lib/platform";

const isIOS = getOperatingSystem() === "iOS";

const props = defineProps({
  top: { type: Boolean, default: true },
  bottom: { type: Boolean, default: true },
  left: { type: Boolean, default: false },
  right: { type: Boolean, default: false },
});
</script>
<style scoped>
.safe-area {
  height: calc(100 * var(--svh, 1vh));
}
</style>
