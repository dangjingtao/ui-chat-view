<template>
  <component
    :is="isComponent ? src : 'img'"
    :src="!isComponent && src"
    alt="SVG Icon"
  >
    <slot v-if="isComponent">{{ src }}</slot>
  </component>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  src?: string | object;
}>();

const isComponent = computed(() => typeof props.src === "object");
</script>

<style scoped>
/* 你可以在这里添加样式 */
</style>
