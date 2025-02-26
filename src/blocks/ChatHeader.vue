<template>
  <header
    class="flex h-11 items-center justify-between gap-1 bg-white px-4 text-gray-500 shadow"
  >
    <div class="text-primary-7 flex-1 font-bold">
      <img :src="logo" class="w-[70px]" alt="UI Chat" srcset="" />
    </div>
    <div>
      <x-select
        dropdownClass="right-[-45px] max-h-[500px] min-w-[400px]"
        :options="props.models"
        @onChange="props.onSelectModel"
        :selectedValue="props.currentModel"
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
      <x-button
        type="ghost"
        class="w-full py-2"
        size="small"
        @click="props.onAddConversation"
      >
        + New Conversation
      </x-button>
    </template>
    <template #content>
      <x-menu
        :selectedItem="props.selectedConversation"
        :menus="props.conversations"
        @deleteMenuItem="props.onDeleteConversation"
        @changeMenuItem="props.onChangeConversation"
      />
    </template>
    <template #footer>
      <div class="flex gap-1">
        <a
          class="flex flex-1 rounded px-1.5 py-1 transition-colors duration-200 hover:bg-gray-100"
          href="javascript:void(0)"
          @click="toSettings"
        >
          <i-mdi-settings class="text-xl text-gray-600" />&nbsp;<span
            class="text-sm leading-6 text-gray-600"
            >Settings</span
          >
        </a>
        <a
          class="flex rounded px-1.5 py-1 transition-colors duration-200 hover:bg-gray-100"
          target="_blank"
          href="https://github.com/dangjingtao/ui-chat-view"
        >
          <i-mdi-github class="text-xl text-gray-600" />&nbsp;<span
            class="text-sm leading-6 text-gray-600"
            >Docs</span
          >
        </a>
      </div>
    </template>
  </x-drawer>
</template>

<script setup lang="ts">
import { ref, defineProps } from "vue";
import logo from "@/assets/logo.png";
import { useRouter } from "vue-router";

const router = useRouter();

const toSettings = () => {
  router.push("/settings");
};

const props = defineProps<{
  models: any[];
  currentModel: string;
  selectedConversation?: string;
  onSelectModel: (model: string) => void;
  onAddConversation: () => void;
  onDeleteConversation: (id: any) => Promise<void>;
  onChangeConversation: (id: any) => Promise<void>;
  conversations: any[];
}>();

const menuOpen = ref(false);

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};
</script>
