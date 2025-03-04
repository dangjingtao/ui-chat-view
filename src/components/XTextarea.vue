<template>
  <div class="relative">
    <textarea
      ref="textarea"
      v-model="value"
      @focus="handleFocus"
      @blur="handleBlur"
      class="hover:border-gray-150 w-full resize-none rounded bg-gray-100 p-2 text-sm outline-none hover:bg-gray-50 focus:border-gray-300"
      :placeholder="placeholder"
      :rows="props.rows"
    ></textarea>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps({
  placeholder: String,
  rows: {
    type: Number,
    default: 3,
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
