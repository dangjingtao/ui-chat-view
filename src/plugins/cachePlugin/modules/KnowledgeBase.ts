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

  // 删除知识库，目前不考虑删除引用
  async deleteKnowledgeBase(knowledgeBaseId) {
    const { cache, lodash } = this;
    const knowledgeBaseList = (await cache.get("knowledgeBaseList")) || [];

    lodash.remove(knowledgeBaseList, { id: knowledgeBaseId });
    await cache.set("knowledgeBaseList", knowledgeBaseList);
    return await this.getKnowledgeBaseList();
  }
}
