<template>
  <div
    :class="{
      'outline-none': !isFocused,
      'outline-primary-light outline-2': isFocused,
    }"
    class="absolute right-0 bottom-5 left-0 z-20 m-auto flex w-[94%] max-w-[800px] flex-col items-end overflow-hidden rounded-lg border border-gray-200 bg-white p-0 shadow-lg md:w-full"
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
      <div class="my-auto flex h-6 gap-2">
        <slot name="functionsGroup"> </slot>
      </div>
      <div class="flex gap-2">
        <x-button
          type="text"
          size="small"
          @click="onSend"
          class="h-[32px] w-[32px] p-0"
        >
          <i-mdi-paperclip class="m-auto block text-lg" />
        </x-button>

        <x-button
          :disabled="!canSend && !props.isSending"
          size="small"
          @click="props.isSending ? onStop() : onSend()"
          class="h-[32px] w-[32px] p-0"
        >
          <i-mdi-send-outline
            v-if="!props.isSending"
            class="m-auto block text-xs text-white"
          />
          <i-mdi-stop v-else class="m-auto block text-xs text-white" />
        </x-button>
      </div>
    </div>
  </div>
  <!-- <div
    class="absolute top-[-40px] right-0 left-0 z-10 m-auto flex h-10 w-[94%] max-w-[800px] min-w-[300px] bg-amber-300"
  ></div> -->
</template>

<script setup lang="ts">
import { ref, watchEffect, nextTick, computed } from "vue";

const textareaValue = ref("");
const sendButtonVisible = ref(false);
const textarea = ref<HTMLTextAreaElement | null>(null);
const isFocused = ref(false);

const controller = new AbortController();

const props = defineProps<{
  onSend: (ctx: any) => void | Promise<void>;
  isSending?: boolean;
  canSend: boolean;
  character?: any;
}>();

const emits = defineEmits(["onStop"]);

const canSend = computed(() => {
  return props.canSend && textareaValue.value.length > 0;
});

const onStop = () => {
  // props.onStop?.();

  emits("onStop");
  // const startTimer = console.time("timer1");

  controller.abort();
};

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
  // 在此写入父组件的onsend方法 X-component不应该介入，也不需要再把状态回传过去。
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
