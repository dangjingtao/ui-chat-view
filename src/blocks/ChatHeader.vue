<template>
  <header
    class="flex h-11 items-center justify-between gap-1 bg-white px-4 py-1.5 text-gray-500 shadow"
  >
    <div class="text-primary-7 flex-1 font-bold">
      <img :src="logo" class="w-[80px]" alt="UI Chat" srcset="" />
    </div>
    <div>
      <x-select
        dropdownClass="right-[-45px] max-h-[500px] min-w-[400px]"
        :options="props.models"
        @onChange="props.onSelectModel"
        :selectedValue="chatStore.defaultCtx?.model"
      />
    </div>
    <button
      class="px-1 py-1.5 text-gray-500 focus:outline-none"
      @click="toggleMenu"
    >
      <i-mdi-menu class="text-[1rem]" />
    </button>
  </header>

  <x-drawer :menuOpen="menuOpen" :toggleMenu="toggleMenu">
    <template #header>
      <div class="flex items-center gap-2 p-2 pt-0">
        <div class="w-[45%]">
          <img
            class="flex-1"
            src="@/assets/images/STORE.png"
            alt=""
            srcset=""
          />
        </div>
        <div class="mt-1 flex flex-row">
          <x-button
            type="text"
            class="w-full py-2"
            size="small"
            @click="props.onAddConversation"
          >
            <i-mdi-plus class="text-lg" />
          </x-button>
          <x-button
            type="text"
            class="w-full py-2"
            size="small"
            @click="props.onOpenCharactors"
          >
            <i-mdi-gauge class="text-lg" />
          </x-button>
          <x-button
            type="text"
            class="w-full py-2"
            size="small"
            @click="toSettings"
          >
            <i-mdi-cog-outline class="text-lg" />
          </x-button>
        </div>
      </div>
    </template>
    <template #content>
      <x-menu
        :selectedItem="chatStore.defaultCtx?.id"
        :menus="chatStore.conversations"
        @deleteMenuItem="props.onDeleteConversation"
        @changeMenuItem="onChangeConversation"
      />
    </template>
    <template #footer>
      <div class="flex gap-1">
        <a
          class="flex w-full rounded px-1.5 py-1 transition-colors duration-200 hover:bg-gray-100"
          target="_blank"
          href="https://github.com/dangjingtao/ui-chat-view"
        >
          <i-mdi-github class="text-xl text-gray-600" />&nbsp;<span
            class="text-sm leading-6 text-gray-600"
          >
            &copy; Tomz Dang (tomz.io)
          </span>
        </a>
      </div>
    </template>
  </x-drawer>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import logo from "@/assets/logo.png";
import { useRouter } from "vue-router";
import { useChatStore } from "@/store/homeStore";

const chatStore = useChatStore();
const { onChangeConversation } = chatStore.$service;

watch(
  () => chatStore.conversationId,
  async (newId, oldId) => {
    console.log(666, newId, oldId);
  },
  { deep: true },
);

const router = useRouter();

const toSettings = () => {
  router.push("/settings");
};

const props = defineProps<{
  models: { id: string; name: string }[];
  currentModel: string;
  selectedConversation?: string;
  onSelectModel: (model: string) => void;
  onAddConversation: () => void;
  onDeleteConversation: (id: any) => Promise<void>;
  onChangeConversation: (id: any) => Promise<void>;
  onOpenCharactors: () => void;
  conversations: any[];
}>();

const menuOpen = ref(false);

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};
</script>
