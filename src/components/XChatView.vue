<template>
  <div
    id="xChatView"
    ref="chatHistory"
    class="mx-auto flex h-full w-[90%] max-w-[890px] flex-col py-2 text-sm"
  >
    <div class="flex-1">
      <div
        v-for="(message, index) in messages"
        :key="index"
        class="chat-item mb-4"
      >
        <div
          :class="{
            'flex justify-end': isUser(message.role),
            'flex justify-start gap-2': !isUser(message.role),
          }"
        >
          <div class="flex max-w-[100%] flex-col gap-1">
            <div class="flex w-full items-end gap-2">
              <div v-if="message.role !== 'user'" class="w-8 min-w-8">
                <img src="@/assets/fmt.webp" alt="" srcset="" />
              </div>
              <div
                class="w-full text-xs text-gray-500"
                :class="
                  isUser(message.role) ? 'text-right' : 'text-left leading-6'
                "
              >
                {{ formateDate(message.timeStamp) }}
              </div>
            </div>

            <div
              :class="{
                'bg-primary-2 ml-auto': isUser(message.role),
                'bg-white': !isUser(message.role),
              }"
              class="inline-block w-max max-w-full flex-auto rounded-lg px-4 py-3"
            >
              <x-think
                v-if="hasThinkContent(message.content)"
                :text="message.content"
              />
              <x-markdown
                :show-cursor="true"
                v-if="!isUser(message.role)"
                :content="removeThinkContent(message.content)"
              />

              <!-- 用户消息 -->
              <div v-else>
                <div
                  v-for="(file, index) in message.fileList || []"
                  :key="index"
                >
                  <x-image-viewer v-if="file.isImage" :src="file.fileBase64">
                    <img
                      class="mb-2 max-h-[400px] max-w-[500px]"
                      v-if="file.isImage"
                      :src="file.fileBase64"
                      alt="userImage"
                      srcset=""
                    />
                  </x-image-viewer>
                </div>
                <x-markdown
                  class="user-markdown"
                  :content="formatContent(message.content)"
                />
              </div>
            </div>
            <div
              class="flex"
              :class="{
                'ml-auto w-max max-w-full flex-auto': isUser(message.role),
              }"
            >
              <x-button
                size="small"
                type="text"
                @click="() => copy(message.content)"
              >
                <i-mdi-content-copy class="text-[0.8rem] text-gray-500" />
              </x-button>
              <x-button
                @click="emits('regenerate', message)"
                size="small"
                v-if="!isUser(message.role)"
                type="text"
              >
                <i-mdi-replay class="text-[1rem] text-gray-500" />
              </x-button>
              <x-button
                @click="emits('deleteMessage', message)"
                size="small"
                type="text"
              >
                <i-mdi-delete-outline class="text-[1rem] text-gray-500" />
              </x-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 虚假的输入中 -->
      <div v-if="props.isSending" class="chat-item mb-4">
        <div class="flex w-full items-end gap-2">
          <div class="w-8 min-w-8">
            <img src="@/assets/fmt.webp" alt="" srcset="" />
          </div>
          <div class="w-full pb-3 text-left text-xs text-gray-500">
            <svg
              width="24"
              height="6"
              viewBox="0 0 24 6"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
            >
              <circle cx="3" cy="3" r="3">
                <animate
                  attributeName="opacity"
                  values="0;1;0"
                  dur="1s"
                  repeatCount="indefinite"
                  begin="0.1"
                />
              </circle>
              <circle cx="12" cy="3" r="3">
                <animate
                  attributeName="opacity"
                  values="0;1;0"
                  dur="1s"
                  repeatCount="indefinite"
                  begin="0.2"
                />
              </circle>
              <circle cx="21" cy="3" r="3">
                <animate
                  attributeName="opacity"
                  values="0;1;0"
                  dur="1s"
                  repeatCount="indefinite"
                  begin="0.3"
                />
              </circle>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, onMounted } from "vue";
import dayjs from "dayjs";
import DOMPurify from "dompurify";
import { extractThinkContent, removeThinkContent } from "@/lib/Chat";
import copy from "@/lib/textProcessor/copy";

const chatHistory = ref<HTMLElement | null>(null);
const isSmallScreen = ref(false);

const formatContent = (content) => {
  // 将转义符号转换为相应的 HTML 标签
  const formattedContent = content
    .replace(/\n/g, "<br>")
    .replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;");
  // 使用 DOMPurify 来清理和转义 HTML 内容
  return DOMPurify.sanitize(formattedContent);
};

const checkScreenSize = () => {
  isSmallScreen.value = window.innerWidth <= 768;
};

const isUser = (role: string) => role === "user";

const hasThinkContent = (content: string) => {
  return extractThinkContent(content).length > 0;
};

const formateDate = (timeStamp: number | string) => {
  return dayjs(timeStamp).format("YYYY-MM-DD HH:mm:ss");
};

const props = defineProps<{
  messages: { role: string; content: string; timeStamp?: number | string }[];
  isSending: boolean;
}>();

const emits = defineEmits(["deleteMessage", "regenerate"]);

onMounted(() => {
  checkScreenSize();
  window.addEventListener("resize", checkScreenSize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", checkScreenSize);
});
</script>
<style scoped>
.chat-item:first-child {
  margin-top: 1.5rem;
}
</style>
