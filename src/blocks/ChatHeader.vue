<template>
  <div>
    <header
      class="flex h-10 items-center justify-between gap-1 bg-white px-4 text-gray-500 shadow"
    >
      <div class="text-primary-7 flex-1 font-bold">
        <img :src="logo" class="w-[100px]" alt="logo" srcset="" />
      </div>
      <div>
        <x-select
          :options="props.models"
          @onChange="props.onSelectModel"
          :selectedValue="props.currentModel"
        />
      </div>
      <div>
        <button
          class="py-1 text-gray-500 focus:outline-none"
          @click="toggleMenu"
        >
          <i-mdi-menu class="text-[1rem]" />
        </button>
      </div>
    </header>

    <x-drawer :menuOpen="menuOpen" :toggleMenu="toggleMenu">
      <template #header>
        <x-brand />
        <x-button
          type="ghost"
          class="mt-2 w-full"
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
    </x-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, watch } from "vue";
import logo from "@/assets/logo.png";

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
