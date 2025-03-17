<template>
  <x-tooltip
    v-if="!props.isPC"
    :position="position"
    :text="t('newConversation')"
  >
    <x-button
      type="text"
      class="w-full py-2"
      size="small"
      @click="onAddConversation"
    >
      <i-mdi-plus class="text-lg" />
    </x-button>
  </x-tooltip>

  <x-tooltip :position="position" :text="t('settings')">
    <x-button type="text" class="w-full py-2" size="small" @click="toSettings">
      <i-mdi-cog-outline class="text-lg" />
    </x-button>
  </x-tooltip>

  <x-tooltip :position="position" :text="t('knowledgeHub')">
    <x-button
      type="text"
      class="w-full py-2"
      size="small"
      @click="toKnowledgeHub"
    >
      <i-mdi-bookmark-box-multiple-outline class="text-lg" />
    </x-button>
  </x-tooltip>

  <x-tooltip :position="position" :text="t('microApps')">
    <x-button
      type="text"
      class="w-full py-2"
      size="small"
      @click="toKnowledgeHub"
    >
      <i-mdi-bookmark-box-multiple-outline class="text-lg" />
    </x-button>
  </x-tooltip>
</template>

<script setup lang="ts">
import { computed } from "vue";
// 入口文件，共用
import { useRouter } from "vue-router";
import { useChatStore } from "@/store/chat";
import { useNamespace } from "@/i18n";

const { t } = useNamespace("ChatView.ChatEntrance");

const props = defineProps<{
  isPC: boolean;
}>();

const position = computed(() => (props.isPC ? "top" : "bottom"));

const chatStore = useChatStore();
const { onAddConversation } = chatStore.$service;

const router = useRouter();

const toSettings = () => {
  router.push("/settings");
};

const toKnowledgeHub = () => {
  router.push("/knowledge-hub");
};
</script>
