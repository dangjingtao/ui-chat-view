<template>
  <div
    :class="[
      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300',
      { 'bg-gray-200': !isChecked, 'bg-geekblue-6': isChecked },
    ]"
    @click="toggleSwitch"
  >
    <span
      :class="[
        'inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300',
        { 'translate-x-1': !isChecked, 'translate-x-6': isChecked },
      ]"
    ></span>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  modelValue: boolean;
  onToggle?: (value: boolean) => void;
}>();

const emits = defineEmits(["update:modelValue"]);

const isChecked = ref(props.modelValue);

const toggleSwitch = () => {
  isChecked.value = !isChecked.value;
  emits("update:modelValue", isChecked.value);
};
</script>

<style scoped>
/* 你可以在这里添加额外的样式 */
</style>
