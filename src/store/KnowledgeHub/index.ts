import clientCache from "@/plugins/cachePlugin";
import { ref, toRaw } from "vue";
import { defineStore } from "pinia";
import type { KnowledgeBaseType } from "@/plugins/cachePlugin/types";
import dialog from "@/lib/dialog";
import _ from "lodash";
import { useRoute } from "vue-router";
import detailService from "./detailService";
import message from "@/lib/message";

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
    window.event?.preventDefault();
    window.event?.stopPropagation();
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
    window.event?.preventDefault();
    window.event?.stopPropagation();
    const result = await dialog.confirm({
      type: "alert",
      title: "确定删除知识库及其下属的文档吗？",
      message: "本地知识库删除后无法恢复",
    });

    if (result) {
      const newKnowledgeBaseList =
        await clientCache.deleteKnowledgeBase(knowledgeBaseId);
      knowledgeBases.value = newKnowledgeBaseList;
    }
    message.success("操作成功");
  };

  const init = async () => {
    const result = await clientCache.getKnowledgeBaseList();
    console.log(result);
    knowledgeBases.value = result || [];
  };

  // -------------详情
  const detailMeta = ref(null);
  const detailDocumentList = ref([]);

  const detailPageCtx = {
    route: useRoute(),
    detailMeta,
    detailDocumentList,
  };

  return {
    isEditModalOpen,
    knowledgeBases,
    currentKnowledgeBase,
    operateMode,
    detailMeta,
    detailDocumentList,
    $service: {
      init,
      updateVisible,
      openEditDialog,
      openAddDialog,
      confirmAddorUpdate,
      confirmDelete,
      /********** **********/
      checkKnowledgeBaseId: detailService.checkKnowledgeBaseId, //路由守卫时用
      getKnowledgeBaseDetail: () =>
        detailService.getKnowledgeBaseDetail(detailPageCtx),
      initKnowledgeBasePage: () =>
        detailService.initKnowledgeBasePage(detailPageCtx),
      onUploadSuccess: () => detailService.onUploadSuccess(detailPageCtx),
      onUploadFailed: (error) =>
        detailService.onUploadFailed(detailPageCtx, error),
      onUpload: (data) => detailService.onUpload(detailPageCtx, data),
      batchUpgrade: (fileList, order) =>
        detailService.batchUpgrade(detailPageCtx, fileList, order),
    },
  };
});
