<template>
  <x-card
    :description="props.knowledgeBaseDescription"
    class="h-[full] w-full cursor-pointer bg-white hover:shadow-sm md:h-[170px]"
  >
    <template #header>
      <div class="flex gap-3">
        <div class="bg-primary-1 border-primary-2 rounded-sm border p-2.5">
          <i-mdi-folder class="text-primary" />
        </div>
        <div class="h-10">
          <div>{{ props.knowledgeBaseName }}</div>
          <div class="text-xs font-normal text-gray-500">
            更新于 {{ updateTime }}
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex gap-2">
        <x-tooltip position="top" text="编辑">
          <x-button class="px-2" @click="openEditDialog" type="text">
            <i-mdi-file-edit-outline />
          </x-button>
        </x-tooltip>

        <x-tooltip position="top" text="应用到当前对话">
          <x-button class="px-2" type="text">
            <i-mdi-cart-check />
          </x-button>
        </x-tooltip>

        <x-tooltip position="top" text="删除">
          <x-button
            @click="confirmDelete"
            class="ml-auto px-2 text-red-600 hover:bg-red-50"
            type="text"
          >
            <i-mdi-delete-empty-outline style="transform: scale(1.1)" />
          </x-button>
        </x-tooltip>
      </div>
    </template>
  </x-card>
</template>
<script setup lang="ts">
import dayjs from "dayjs";
import { computed } from "vue";

const props = defineProps<{
  updateTime: string | number;
  knowledgeBaseName: string;
  knowledgeBaseDescription: string;
}>();

const updateTime = computed(() => {
  return dayjs(props.updateTime).format("YYYY-MM-DD HH:mm:ss");
});

const emit = defineEmits(["openEditDialog", "confirmDelete"]);

const openEditDialog = () => {
  emit("openEditDialog");
};

const confirmDelete = () => {
  emit("confirmDelete");
};
</script>
