<template>
  <div>
    <header
      class="flex h-10 items-center justify-between gap-2.5 bg-white px-4 text-gray-500 shadow"
    >
      <div class="text-primary-7 flex-1 font-bold">UI-Chat-View</div>
      <div>
        <x-select
          :options="modelList"
          @onChange="onSlectModel"
          :selectedValue="currentModel"
        />
      </div>
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
        <x-menu />
      </template>
    </x-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useCache } from "@/plugins/cachePlugin";
import request from "@/lib/request";

const modelList = ref([]);
const currentModel = ref("");
const menuOpen = ref(false);

const clientCache = useCache();

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

const onSlectModel = async (id) => {
  await clientCache.setCurrentModel(id);
};

onMounted(async () => {
  const currentModelCtx = await clientCache.getCurrentModelContext();
  console.log(1111, currentModelCtx);
  const { URLs, current_model_name } = currentModelCtx;
  const { data } = await request.get(URLs.models);
  console.log(current_model_name);
  currentModel.value = current_model_name;
  console.log(current_model_name);
  modelList.value = data.map((x) => ({ id: x.id, name: x.id }));
});
</script>
