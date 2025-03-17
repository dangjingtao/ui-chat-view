<template>
  <div
    :class="{
      'outline-none': !isFocused,
      'outline-primary-5 outline-1': isFocused,
    }"
    class="absolute right-0 bottom-0 left-0 z-10 m-auto flex w-full flex-col items-end overflow-hidden rounded-lg border border-gray-300 bg-white p-0 transition-all duration-300 ease-in-out sm:w-full md:bottom-6 md:w-[90%]"
  >
    <div v-if="fileList.length > 0" class="m-auto h-20 w-full rounded bg-white">
      <div class="mx-2 flex gap-2">
        <div
          class="group relative mt-[10px] flex h-[60px] w-[280px] rounded-md bg-gray-100"
          v-for="file in fileList"
        >
          <div class="h-[60px] w-[60px] overflow-hidden rounded-l-lg">
            <img
              :title="file.name"
              v-if="file.isImage"
              class="h-full w-full object-cover"
              :src="file.fileBase64"
            />
            <i-mdi-file-check-outline class="h-full text-5xl" v-else />
          </div>
          <div class="flex-1 pl-1.5 break-words">
            <div class="mb-0.5 line-clamp-2 p-1 pb-0 text-xs text-gray-600">
              {{ file.name }}
            </div>
            <div class="px-1 py-0.5 text-xs text-gray-600">
              {{ file.size }}
            </div>
          </div>

          <button
            class="absolute top-0 right-0 h-4 w-4 cursor-pointer rounded-full bg-red-500 p-0 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
            @click="removeFile(file)"
          >
            &times;
          </button>
        </div>
      </div>
    </div>
    <textarea
      @keydown="handleKeyDown"
      v-model="textareaValue"
      placeholder="Input your message here"
      class="text-md max-h-[12em] w-full resize-none overflow-hidden border-0 p-2 text-gray-700 focus:outline-none"
      rows="2"
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
          class="relative h-[32px] w-[32px] cursor-pointer p-0"
        >
          <x-upload
            @upload="onUpload"
            @uploadFailed="onUploadError"
            :accept="'image/*'"
            class="relative h-[32px] w-[32px] cursor-pointer overflow-hidden rounded-md"
          ></x-upload>
          <!-- <i-mdi-paperclip class="m-auto block text-lg" /> -->
          <i-mdi-file-image-outline
            class="absolute top-1.5 left-1.5 m-auto block text-lg"
          />
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
</template>

<script setup lang="ts">
import message from "@/lib/message";
import { ref, watchEffect, nextTick, computed, toRaw } from "vue";
import { getOperatingSystem } from "@/lib/platform";

const isIOS = getOperatingSystem() === "iOS";
interface FileItem {
  isImage: boolean;
  fileBase64: string;
  name: string;
  size: string;
}

const fileList = ref<FileItem[]>([]);
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

const isImageFile = (file: File): boolean => {
  return file.type.startsWith("image/");
};

const onUpload = ({ document, fileBase64 }) => {
  const isImage = isImageFile(document);
  // fileList.value.push({
  //   isImage,
  //   fileBase64,
  //   name: document.name,
  //   size: `${Math.ceil((document.size / 1000 / 1000) * 100) / 100} MB`,
  // });

  fileList.value = [
    {
      isImage,
      fileBase64,
      name: document.name,
      size: `${Math.ceil((document.size / 1000 / 1000) * 100) / 100} MB`,
    },
  ];
};

const onUploadError = (error) => {
  console.error(error);
  message.error("Load File Error:" + error);
};

const removeFile = (file) => {
  fileList.value = fileList.value.filter((f) => f !== file);
};

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
  props.onSend?.({
    role: "user",
    content: textareaValue.value,
    fileList: toRaw(fileList.value),
  });

  fileList.value = [];
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
