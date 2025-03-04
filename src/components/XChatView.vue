<template>
  <div
    id="xChatView"
    ref="chatHistory"
    class="mx-auto flex h-full w-[90%] max-w-[800px] flex-col py-2 text-sm"
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
          <div class="flex max-w-[100%] flex-col gap-1 sm:max-w-[90%]">
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
                v-if="!isUser(message.role)"
                :content="removeThinkContent(message.content)"
              />
              <x-markdown
                class="user-markdown"
                v-else
                :content="formatContent(message.content)"
              />
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
                @click="emits('regenarate', message)"
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

defineProps<{
  messages: { role: string; content: string; timeStamp?: number | string }[];
}>();

const emits = defineEmits(["deleteMessage", "regenarate"]);

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
