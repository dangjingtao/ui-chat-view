<template>
  <x-subpage-wrapper title="知识库">
    <template #content>
      <div class="flex h-full flex-col">
        <div class="min-h-[50px] w-full p-1 shadow">
          <x-card
            title="创建知识库"
            @click="openAddDialog"
            class="h-[full] w-full cursor-pointer hover:shadow-sm"
          >
            <template #body>
              导入您自己的文本数据或通过 Webhook 实时写入数据以增强 LLM
              的上下文。
            </template>
          </x-card>
        </div>
        <div class="flex-1 overflow-auto bg-gray-50">
          <div
            :class="{
              grid: knowledgeBaseStore.knowledgeBases.length !== 0,
            }"
            class="auto-rows-[210px] grid-cols-1 justify-between gap-4 overflow-auto bg-gray-50 p-2.5 md:grid-cols-2 lg:grid-cols-3"
          >
            <x-empty
              v-if="knowledgeBaseStore.knowledgeBases.length === 0"
              class="m-auto w-[100%] lg:w-[60%]"
            />
            <knowledge-card
              v-else
              v-for="knowledgeBase in knowledgeBaseStore.knowledgeBases"
              :key="knowledgeBase.id"
              :updateTime="knowledgeBase.updateTime"
              :createTime="knowledgeBase.createTime"
              :knowledgeBaseName="knowledgeBase.knowledgeBaseName"
              :knowledgeBaseDescription="knowledgeBase.knowledgeBaseDescription"
              @confirmDelete="() => confirmDelete(knowledgeBase.id)"
              @openEditDialog="() => openEditDialog(knowledgeBase)"
              @click="() => toKnowledgeBase(knowledgeBase.id)"
            />

            <div class="mt-1"></div>
          </div>
        </div>
      </div>
      <operate-knowledge-dialog
        :defaultFormData="knowledgeBaseStore.currentKnowledgeBase"
        :isEditModalOpen="knowledgeBaseStore.isEditModalOpen"
        :operateMode="knowledgeBaseStore.operateMode"
        @confirm="confirmAddorUpdate"
        @updateVisible="updateVisible"
      />
    </template>
  </x-subpage-wrapper>
</template>
<script lang="ts" setup>
import { useChatStore } from "@/store/chat";
import { useKnowledgeBaseStore } from "@/store/KnowledgeHub";
import _ from "lodash";
import KnowledgeCard from "./components/KnowledgeCard.vue";
import OperateKnowledgeDialog from "./components/OperateKnowledgeDialog.vue";
import { useRouter } from "vue-router";

const router = useRouter();

const toKnowledgeBase = (baseId) => {
  router.push(`/knowledge-base/${baseId}`);
};

const chatStore = useChatStore();
const knowledgeBaseStore = useKnowledgeBaseStore();

const {
  init,
  updateVisible,
  openEditDialog,
  openAddDialog,
  confirmDelete,
  confirmAddorUpdate,
} = knowledgeBaseStore.$service;
init();
</script>
<style scoped></style>
