import Base from "./Base";

// 只存基础数据
export default class extends Base {
  getCurrentConversation: any;
  updateConversation: any;
  getConversationById: any;
  // 设置当前对话的角色
  async updateCharacter(character) {
    const { cache, lodash } = this;
    const currentConversation = await this.getCurrentConversation();
    const clonedCharacter = lodash.cloneDeep(character);
    if (!currentConversation) {
      cache.set("character", clonedCharacter);
      return null;
    } else {
      const newConversation = {
        ...currentConversation,
        character: clonedCharacter,
      };
      await this.updateConversation(currentConversation.id, newConversation);

      return await this.getConversationById(currentConversation.id);
    }
  }
}
