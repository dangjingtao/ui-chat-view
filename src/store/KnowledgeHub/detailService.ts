import clientCache from "@/plugins/cachePlugin";
import wrapWithTryCatch from "@/lib/wrapWithTryCatch";
import message from "@/lib/message";

const service = {
  async _getKnowledgeBaseDetail(ctx) {
    const { route } = ctx;
    const knowledgeBaseId = route.params.id;
    return await clientCache.getKnowledgeBaseDetail(knowledgeBaseId);
  },

  async initKnowledgeBasePage(ctx) {
    const { detailMeta, detailDocumentList } = ctx;
    const { meta = {}, documentList } = await this._getKnowledgeBaseDetail(ctx);
    detailMeta.value = meta;
    detailDocumentList.value = documentList;
  },

  async onUploadSuccess(ctx) {
    message.success("上传成功");
    console.log(ctx);
  },

  async onUploadFailed(ctx, error) {
    console.log(error);
    message.error(`上传失败: ${error}`);
  },

  async onUpload(ctx, data) {
    try {
      const { route } = ctx;
      data.knowledgeBaseId = route.params.id;
      const { fileBase64, fileType, document } = data;
      const uploadData = {
        fileName: document.name,
        fileSize: document.size,
        fileBase64,
        fileType,
        knowledgeBaseId: route.params.id,
      };
      // console.log(uploadData);
      ctx.detailDocumentList.value =
        await clientCache.addKnowledgeBaseDocument(uploadData);
      return {
        error: null,
        message: "success",
      };
    } catch (error) {
      return {
        error,
      };
    }
  },

  // 路由方法
  async checkKnowledgeBaseId(id) {
    return await clientCache.checkKnowledgeBaseIfExist(id);
  },

  // 批量启用/禁用，删除 之后更新列表
  async batchUpgrade(ctx, fileIdList, order) {
    const { route } = ctx;
    const knowledgeBaseId = route.params.id;
    const batchCtx = { fileIdList, order, knowledgeBaseId };
    const result = await clientCache.batchUpdateKnowledgeBaseDocument(batchCtx);
    ctx.detailDocumentList.value = result;
  },
};

export default wrapWithTryCatch(service);
