<template>
  <div class="mb-2">
    <p class="py-2 text-sm text-gray-600">
      {{ label }}
    </p>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { inject, ref, watch } from "vue";

const props = defineProps<{
  name: string;
  label: string;
}>();

// const formData = inject<Record<string, any>>("formData");

// const localValue = ref(formData?.[props.name] ?? "");

// const updateValue = (newValue: any) => {
//   console.log(newValue);
//   localValue.value = newValue;
// };

// watch(localValue, (newValue) => {
//   if (formData) {
//     formData[props.name] = newValue;
//   }
// });

// watch(
//   () => (formData ? formData[props.name] : undefined),
//   (newVal) => {
//     localValue.value = newVal;
//   },
// );
</script>

<style scoped>
/* 在这里添加你的样式 */
</style>
