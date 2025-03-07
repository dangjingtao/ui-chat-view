import Base from "./Base";

// 只存基础数据
export default class extends Base {
  // 查询知识库
  async getKnowledgeBaseList() {
    const { cache } = this;
    return await cache.get("knowledgeBaseList");
  }

  // 更新或新增知识库，只存基础数据
  async updateKnowledgeBase(knowledgeBase) {
    const { cache, lodash } = this;
    const { id = this.uuidV4() } = knowledgeBase;
    const knowledgeBaseList = (await cache.get("knowledgeBaseList")) || [];
    const index = lodash.findIndex(knowledgeBaseList, { id });

    if (index !== -1) {
      knowledgeBaseList[index] = {
        ...knowledgeBaseList[index],
        ...knowledgeBase,
        updateTime: Date.now(),
      };
    } else {
      knowledgeBase.createTime = Date.now();
      knowledgeBase.updateTime = Date.now();
      knowledgeBase.id = id;
      knowledgeBaseList.push(knowledgeBase);
    }

    await cache.set("knowledgeBaseList", knowledgeBaseList);
    return await this.getKnowledgeBaseList();
  }

  // 辅助函数：获取知识库的文档 ID 列表
  async _getKnowledgeBaseDocumentIds(knowledgeBaseId) {
    const documentList =
      await this.getKnowledgeBaseDocumentList(knowledgeBaseId);
    return documentList.map((item) => item.id);
  }

  // 辅助函数。批量操作数据表
  async _updateKnowledgeBaseDocumentList({ order, fileIdList }, updateFn) {
    const allDocumentList = await this.getKnowledgeBaseDocumentList();
    const allFileMap = new Map(allDocumentList.map((file) => [file.id, file]));

    for (const fileId of fileIdList) {
      if (allFileMap.has(fileId)) {
        await updateFn(allFileMap, fileId, order);
      }
    }

    const updatedDocumentList = Array.from(allFileMap.values());
    await this.cache.set("knowledgeBaseDocumentList", updatedDocumentList);
    return updatedDocumentList;
  }

  // 删除知识库，同时删除引用
  async deleteKnowledgeBase(knowledgeBaseId) {
    const { cache, lodash } = this;
    // 获取知识库列表
    const knowledgeBaseList = (await cache.get("knowledgeBaseList")) || [];

    // 删除指定知识库
    lodash.remove(knowledgeBaseList, { id: knowledgeBaseId });
    await cache.set("knowledgeBaseList", knowledgeBaseList);

    // 获取附属文档的 ID 列表
    const fileIdList = await this._getKnowledgeBaseDocumentIds(knowledgeBaseId);

    // 批量删除附属文档
    await this.batchUpdateKnowledgeBaseDocument({
      knowledgeBaseId,
      order: "delete",
      fileIdList,
    });

    // 返回更新后的知识库列表
    return await this.getKnowledgeBaseList();
  }

  // 获取文档元数据
  async getKnowledgeBaseDocumentMetaById(knowledgeBaseId) {
    const list = await this.getKnowledgeBaseList();
    const knowledgeBase = list.find((item) => item.id === knowledgeBaseId);
    return knowledgeBase;
  }

  // 检查是否存在
  async checkKnowledgeBaseIfExist(knowledgeBaseId) {
    const knowledgeBaseList = await this.getKnowledgeBaseList();
    return !!knowledgeBaseList.find((item) => item.id === knowledgeBaseId);
  }

  // 添加文件
  async addKnowledgeBaseDocument(data) {
    const { cache } = this;
    const { knowledgeBaseId } = data;

    const checkIfExist = await this.checkKnowledgeBaseIfExist(knowledgeBaseId);
    if (!checkIfExist) {
      throw new Error("知识库不存在");
    }

    // 获取全部
    const documentList = await this.getKnowledgeBaseDocumentList();
    const createdData = this.generateNewDataMeta(data);
    createdData.status = "enable";

    documentList.push(createdData);
    await cache.set("knowledgeBaseDocumentList", documentList);
    return await this.getKnowledgeBaseDocumentList(knowledgeBaseId);
  }

  // 获取知识库下面的文档列表,没有就初始化(慢交易)
  async getKnowledgeBaseDocumentList(knowledgeBaseId?) {
    const { cache } = this;
    const allFileList = (await cache.get(`knowledgeBaseDocumentList`)) || [];
    return knowledgeBaseId
      ? allFileList.filter((item) => item.knowledgeBaseId === knowledgeBaseId)
      : allFileList;
  }

  // 初始化
  async getKnowledgeBaseDetail(id) {
    const meta = await this.getKnowledgeBaseDocumentMetaById(id);
    const documentList = await this.getKnowledgeBaseDocumentList(id);
    return { meta, documentList };
  }

  async batchUpdateKnowledgeBaseDocument(batchCtx) {
    const { knowledgeBaseId, order, fileIdList } = batchCtx;
    await this._updateKnowledgeBaseDocumentList(
      { fileIdList, order },
      async (allFileMap, fileId, order) => {
        const existingFile = allFileMap.get(fileId);
        if (existingFile) {
          if (order !== "delete") {
            existingFile.status = order;
          } else {
            allFileMap.delete(fileId);
          }
        }
      },
    );

    return await this.getKnowledgeBaseDocumentList(knowledgeBaseId);
  }
}
