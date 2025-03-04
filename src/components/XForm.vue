<template>
  <div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { provide, reactive, watch, defineExpose } from "vue";

const props = defineProps<{
  model: Record<string, any>;
}>();

const formData = reactive({ ...props.model });

provide("formData", formData);

watch(
  () => props.model,
  (newVal) => {
    Object.assign(formData, newVal);
  },
);

defineExpose({
  getFormData: () => {
    return formData;
  },
});
</script>

<style scoped>
/* 在这里添加你的样式 */
</style>
