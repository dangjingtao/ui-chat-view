<template>
  <div>
    <header
      class="flex h-10 items-center justify-between gap-2.5 bg-white px-4 text-gray-500 shadow"
    >
      <div>
        <x-select />
      </div>
      <div class="text-primary-7 flex-1 font-bold">Greeting!</div>
      <div>
        <button class="text-gray-500 focus:outline-none" @click="toggleMenu">
          <svg
            class="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
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
          @click="toggleMenu"
        >
          + New Conversation
        </x-button>
      </template>
      <template #content>
        <x-menu class="custom-scrollbar" />
      </template>
    </x-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const menuOpen = ref(false);

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};
</script>

<style scoped>
.custom-scrollbar {
  overflow-y: auto; /* 允许垂直滚动 */
}

.custom-scrollbar::-webkit-scrollbar {
  width: 8px; /* 滚动条宽度 */
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #888; /* 滚动条颜色 */
  border-radius: 4px; /* 滚动条圆角 */
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #555; /* 滚动条悬停颜色 */
}

.custom-scrollbar::-webkit-scrollbar-track {
  background-color: #f1f1f1; /* 滚动条轨道颜色 */
}
</style>
