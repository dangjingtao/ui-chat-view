<template>
  <div
    :class="{
      'outline-none': !isFocused,
      'outline-primary-light outline-2': isFocused,
    }"
    class="absolute right-0 bottom-0 left-0 m-auto mb-4 flex w-[90%] max-w-[800px] min-w-[300px] items-end overflow-hidden rounded-lg border border-gray-200 bg-white p-0 shadow-lg"
  >
    <textarea
      @keydown="handleKeyDown"
      v-model="textareaValue"
      placeholder="输入消息..."
      class="max-h-[12em] w-full resize-none overflow-hidden border-0 p-2 focus:outline-none"
      rows="1"
      @input="autoResize"
      ref="textarea"
      @focus="handleFocus"
      @blur="handleBlur"
    ></textarea>
    <x-button :disabled="!sendButtonVisible" class="h-10" @click="onSend">
      <i-mdi-send-outline class="text-[1rem] text-white" />
    </x-button>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, onMounted, onBeforeUnmount, nextTick } from "vue";

const textareaValue = ref("");
const sendButtonVisible = ref(false);
const textarea = ref(null);
const isFocused = ref(false);

const props = defineProps<{
  onSend?: () => void;
  onStop?: () => void;
}>();

const handleFocus = () => {
  isFocused.value = true;
};

const handleBlur = () => {
  isFocused.value = false;
};

watchEffect(() => {
  sendButtonVisible.value = textareaValue.value.length > 0;
});

const autoResize = () => {
  const el = textarea.value;
  el.style.height = "auto";
  el.style.height = `${el.scrollHeight}px`;
  if (el.scrollHeight > el.clientHeight) {
    el.style.overflowY = "auto";
  } else {
    el.style.overflowY = "hidden";
  }
};

const onSend = async () => {
  await nextTick();
  autoResize();
  // 在此写入父组件的onsend方法
  props.onSend?.({ role: "user", content: textareaValue.value });
  textareaValue.value = "";
};

const handleKeyDown = (event: KeyboardEvent) => {
  if (
    (event.ctrlKey && event.key === "Enter") ||
    (event.metaKey && event.key === "Enter")
  ) {
    sendButtonVisible && onSend();
  }
};
</script>

<style scoped></style>
