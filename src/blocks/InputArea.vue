<template>
  <div
    :class="{
      'outline-none': !isFocused,
      'outline-primary-light outline-2': isFocused,
    }"
    class="absolute right-0 bottom-[25px] left-0 m-auto mb-4 flex w-[94%] max-w-[800px] min-w-[300px] flex-col items-end overflow-hidden rounded-lg border border-gray-200 bg-white p-0 shadow-lg"
  >
    <textarea
      @keydown="handleKeyDown"
      v-model="textareaValue"
      placeholder="Input your message here"
      class="max-h-[12em] w-full resize-none overflow-hidden border-0 p-2 focus:outline-none"
      rows="1"
      @input="autoResize"
      ref="textarea"
      @focus="handleFocus"
      @blur="handleBlur"
    ></textarea>
    <div class="flex w-full justify-between px-2 py-1">
      <div class="flex gap-2">
        <x-button type="text" size="small" @click="props.onStop" class="h-8">
          角色预设
        </x-button>
        <x-button type="text" size="small" @click="props.onStop" class="h-8">
          attachment
        </x-button>
        <x-button type="text" size="small" @click="props.onStop" class="h-8">
          联网搜索
        </x-button>
      </div>
      <x-button
        v-if="!props.isSending"
        :disabled="!canSend"
        size="small"
        round
        @click="onSend"
        class="h-[24px] w-[24px] pl-[6px] text-center"
      >
        <i-mdi-send-outline class="text-xs text-white" />
      </x-button>

      <x-button
        v-else
        size="small"
        round
        @click="onSend"
        class="h-[24px] w-[24px] p-[5px] text-center"
      >
        <i-mdi-stop class="text-xs text-white" />
      </x-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, nextTick, computed } from "vue";

const textareaValue = ref("");
const sendButtonVisible = ref(false);
const textarea = ref<HTMLTextAreaElement | null>(null);
const isFocused = ref(false);

const props = defineProps<{
  onSend: (ctx: any) => void | Promise<void>;
  onStop?: () => void;
  isSending?: boolean;
  canSend: boolean;
}>();

const canSend = computed(() => {
  return props.canSend && textareaValue.value.length > 0;
});

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
  if (el) {
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
    if (el.scrollHeight > el.clientHeight) {
      el.style.overflowY = "auto";
    } else {
      el.style.overflowY = "hidden";
    }
  }
};

const onSend = async () => {
  if (!canSend.value) return;
  // 在此写入父组件的onsend方法
  props.onSend?.({ role: "user", content: textareaValue.value });
  textareaValue.value = "";
  await nextTick();
  autoResize();
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

<style scoped>
::placeholder {
  color: var(--color-gray-400); /* 或者你可以使用其他颜色变量 */
}
</style>
