import clientCache from "@/plugins/cachePlugin";
import { ref, toRaw } from "vue";
import { defineStore } from "pinia";
import type { KnowledgeBaseType } from "@/plugins/cachePlugin/types";
import { v4 } from "uuid";
import dialog from "@/lib/dialog";
import _ from "lodash";

export const useKnowledgeBaseStore = defineStore("knowledgeHub", () => {
  const knowledgeBases = ref<KnowledgeBaseType[]>([]);
  const isEditModalOpen = ref(false);
  const operateMode = ref<string | null>(null);
  const currentKnowledgeBase = ref(null);

  const updateVisible = (bool) => {
    isEditModalOpen.value = bool;
  };

  // 防止循环中的篡改数据非常重要
  const openEditDialog = async (knowledgeBase) => {
    const clonedKnowledgeBase = _.cloneDeep(toRaw(knowledgeBase));
    operateMode.value = "edit";
    isEditModalOpen.value = true;
    currentKnowledgeBase.value = clonedKnowledgeBase;
  };

  const openAddDialog = async () => {
    operateMode.value = "add";
    currentKnowledgeBase.value = null;
    updateVisible(true);
  };

  // 这里“前端”不再处理数据结构，由clientCache决定
  const confirmAddorUpdate = async (ctx) => {
    const { formData } = ctx;
    const rawFormData = toRaw(formData); // 将响应式数据转换为普通数据
    // 似乎不用关心是啥模式了。
    const newKnowledgeBaseList =
      await clientCache.updateKnowledgeBase(rawFormData);
    knowledgeBases.value = newKnowledgeBaseList;
  };

  const confirmDelete = async (knowledgeBaseId) => {
    const result = await dialog.confirm({
      type: "alert",
      title: "确定删除吗？",
      message: "本地知识库删除后无法恢复",
    });

    if (result) {
      const newKnowledgeBaseList =
        await clientCache.deleteKnowledgeBase(knowledgeBaseId);
      knowledgeBases.value = newKnowledgeBaseList;
    }
  };

  const init = async () => {
    const result = await clientCache.getKnowledgeBaseList();
    console.log(result);
    knowledgeBases.value = result || [];
  };

  return {
    isEditModalOpen,
    knowledgeBases,
    currentKnowledgeBase,
    operateMode,
    $service: {
      init,
      updateVisible,
      openEditDialog,
      openAddDialog,
      confirmAddorUpdate,
      confirmDelete,
    },
  };
});
