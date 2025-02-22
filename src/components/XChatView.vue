<template>
  <div
    id="xChatView"
    ref="chatHistory"
    @mouseenter="enableScroll"
    @mouseleave="disableScroll"
    class="mx-auto flex h-full w-[90%] max-w-[800px] flex-col py-2 text-sm md:overflow-auto"
  >
    <div class="flex-1" ref="chatHistory">
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
                'bg-primary-2': isUser(message.role),
                'bg-white': !isUser(message.role),
              }"
              class="inline-block rounded-lg px-4"
            >
              <div
                class="text-md inline-block max-w-full leading-10"
                v-if="message.role === 'user'"
              >
                {{ message.content }}
              </div>
              <div class="pt-1.5 pb-3" v-else>
                <x-think
                  v-if="hasThinkContent(message.content)"
                  :text="message.content"
                />
                <MdPreview
                  editorId="preview-only"
                  previewTheme="vuepress"
                  codeTheme="github"
                  :modelValue="removeThinkContent(message.content)"
                />
              </div>
              <!-- {{ message.content }} -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { MdPreview } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import { extractThinkContent, removeThinkContent } from "@/lib/Chat";
import { ref, onMounted, onBeforeUnmount } from "vue";

const chatHistory = ref<HTMLElement | null>(null);
const isSmallScreen = ref(false);

const checkScreenSize = () => {
  isSmallScreen.value = window.innerWidth <= 768;
};

const enableScroll = () => {
  if (chatHistory.value && !isSmallScreen.value) {
    chatHistory.value.style.overflowY = "auto";
  }
};

const disableScroll = () => {
  if (chatHistory.value) {
    chatHistory.value.style.overflowY = "hidden";
  }
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
