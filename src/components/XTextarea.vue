<template>
  <textarea
    ref="textarea"
    v-model="value"
    @focus="handleFocus"
    @blur="handleBlur"
    class="focus:outline-primary-4 w-full rounded-md border border-gray-200 bg-gray-100 px-2 py-1.5 text-sm text-gray-700 transition-all hover:bg-gray-50 focus:bg-white"
    :class="[
      {
        'cursor-not-allowed bg-gray-200 text-gray-400 hover:bg-gray-200 focus:bg-gray-200':
          props.disabled,
      },
      props.resize === 'none' ? 'resize-none' : '',
      props.resize === 'both' ? 'resize' : '',
      props.resize === 'horizontal' ? 'resize-x' : '',
      props.resize === 'vertical' ? 'resize-y' : '',
    ]"
    :placeholder="placeholder"
    :rows="props.rows"
    :disabled="props.disabled"
  ></textarea>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps({
  placeholder: String,
  resize: {
    type: String,
    default: "vertical",
  },
  rows: {
    type: Number,
    default: 3,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

const value = defineModel<string>();
const textarea = ref<HTMLTextAreaElement | null>(null);
const isFocused = ref(false);

const handleFocus = () => {
  isFocused.value = true;
};

const handleBlur = () => {
  isFocused.value = false;
};

watch(value, (newValue) => {
  emit("update:modelValue", newValue);
});
</script>

<style scoped>
textarea::placeholder {
  font-size: 0.875rem; /* 调整 placeholder 的字体大小 */
}

textarea {
  font-size: 0.875rem; /* 调整输入文字的字体大小 */
}
</style>
