<template>
  <div class="flex items-center">
    <input
      ref="checkbox"
      type="checkbox"
      :checked="isChecked"
      :indeterminate.prop="isIndeterminate"
      @change="toggle"
      class="form-checkbox accent-primary-6 h-4 w-4 transition duration-150 ease-in-out"
    />
    <label class="ml-2 text-gray-700">{{ label }}</label>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { useAttrs, useSlots, defineProps, defineEmits } from "vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  indeterminate: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: "",
  },
  checked: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "change"]);

const checkbox = ref(null);

const isChecked = computed(() => props.modelValue || props.checked);
const isIndeterminate = computed(() => props.indeterminate);

const toggle = (event) => {
  emit("update:modelValue", event.target.checked);
  emit("change", event.target.checked);
};

watch(
  () => props.indeterminate,
  (newVal) => {
    if (checkbox.value) {
      checkbox.value.indeterminate = newVal;
    }
  },
);
</script>

<style scoped>
/* 你可以在这里添加自定义样式 */
</style>
