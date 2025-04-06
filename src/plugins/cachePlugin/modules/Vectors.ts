import Base from "./Base";

const DB_NAME = "VectorsDB"; // 向量数据库名称
// 出于语义化考虑。向量数据库需要通过name来调用，通过key只是保留基础验证

export default class extends Base {
  // 获取所有向量数据库
  private async getVectorDataBases() {
    const { cache } = this;
    return (await cache.get(DB_NAME)) || [];
  }

  // 获取指定向量数据库
  private async getVectorDataBaseById(key) {
    const vectorsDB = await this.getVectorDataBases();
    return vectorsDB.find((item) => item.id === key);
  }

  // 获取指定向量数据库
  public async getVectorDataBaseByName(name) {
    const vectorsDB = await this.getVectorDataBases();
    return vectorsDB.find((item) => item.name === name);
  }

  // 增加一条向量数据库
  async addVectorDataBase(record) {
    const { cache } = this;
    const { name } = record;
    if (!name) {
      throw new this.CommonError("向量数据库名称不能为空", { status: 400 });
    }

    // 先检查是否存在
    const vectorsDB = await this.getVectorDataBaseByName(name);
    if (vectorsDB) {
      throw new this.CommonError("向量数据库已存在", { status: 400 });
    }

    // 如果不存在，则添加
    const formatRecord = this.generateNewDataMeta(record);
    const vectorDataBases = (await this.getVectorDataBases()) || [];
    await cache.set(DB_NAME, [...vectorDataBases, formatRecord]);
  }

  // 删除一条向量数据库
  async deleteVectorDataBase(id) {
    const { cache } = this;
    const vectorDataBases = (await this.getVectorDataBases()) || [];
    const newRecords = vectorDataBases.filter((item) => item.id !== id);
    cache.set(DB_NAME, newRecords);
  }

  // 根据name更新向量数据库
  async updateVectorDataBaseByName(name, record) {
    const { cache } = this;
    const vectorDataBases = (await this.getVectorDataBases()) || [];
    const newRecords = vectorDataBases.map((item) => {
      if (item.name === name) {
        return { ...item, ...record };
      }
      return item;
    });
    cache.set(DB_NAME, newRecords);
  }

  // 根据 ID 更新向量数据库
  private async setVectorDataBaseByKey(id, record) {
    const { cache } = this;
    const vectorDataBases = (await this.getVectorDataBases()) || [];
    const newRecords = vectorDataBases.map((item) => {
      if (item.id === id) {
        return { ...item, ...record };
      }
      return item;
    });
    cache.set(DB_NAME, newRecords);
  }
}
