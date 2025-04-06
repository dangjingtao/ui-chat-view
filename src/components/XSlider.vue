<template>
  <div class="flex items-center gap-2 py-1">
    <input
      type="range"
      v-model="internalValue"
      @input="updateValue"
      :min="min"
      :max="max"
      :step="step"
      :class="{
        'bg-primary-2 inline-block max-h-1.5 min-h-1.5 w-full cursor-pointer appearance-none rounded-lg': true,
        inputClass: props.vertical,
      }"
      :style="
        props.vertical
          ? 'writing-mode: bt-lr; -webkit-appearance: slider-vertical'
          : ''
      "
    />
    <span
      v-if="!props.hideValue"
      class="inline-block min-w-[1/10] text-right text-sm font-semibold text-gray-500"
      >{{ internalValue }}</span
    >
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps({
  min: {
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
    default: 100,
  },
  step: {
    type: Number,
    default: 1,
  },
  modelValue: {
    type: Number,
    default: 50,
  },
  hideValue: {
    type: Boolean,
    default: false,
  },
  inputClass: {
    type: String,
    default: "",
  },
  vertical: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

const internalValue = ref(props.modelValue);

watch(
  () => props.modelValue,
  (newValue) => {
    internalValue.value = newValue;
  },
);

const updateValue = (event: Event) => {
  const newValue = Number((event.target as HTMLInputElement).value);
  internalValue.value = newValue;
  emit("update:modelValue", newValue);
};
</script>

<style scoped>
/* 使用 Tailwind CSS 无需额外样式 */
</style>
