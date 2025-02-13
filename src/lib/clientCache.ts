import localforage from "localforage";
const NAME_SPACE = "ui_chat_view";

type Cache = typeof localforage;

class ClientCache {
  cache!: Cache;

  constructor() {
    this.cache = this.createInstance();
  }

  async initDatabase(schema: any) {
    for (const key in schema) {
      if (Object.prototype.hasOwnProperty.call(schema, key)) {
        const value = schema[key];
        await this.initSchema(key, value);
      }
    }
  }

  async initSchema(tableName: string, schema: any) {
    await this.set(tableName, schema);
  }

  async checkDatabaseExists(flagKey: string) {
    try {
      const value = await this.get(flagKey);
      return value !== null;
    } catch (error) {
      console.error("检查数据库时出错", error);
    }
  }

  private createInstance() {
    return localforage.createInstance({
      driver: localforage.INDEXEDDB,
      name: NAME_SPACE,
      version: 1.0,
      storeName: NAME_SPACE,
      description: "Some description",
    });
  }

  async set(key: string, value: any): Promise<void> {
    try {
      await this.cache.setItem(key, value);
    } catch (error) {
      console.error(`Error storing item for key "${key}":`, error);
    }
  }

  async get(key: string): Promise<any> {
    try {
      const storedValue = await this.cache.getItem(key);
      return storedValue;
    } catch (error) {
      console.error(`Error parsing item for key "${key}":`, error);
      return null;
    }
  }

  async clear(): Promise<void> {
    try {
      await this.cache.clear();
    } catch (error) {
      console.error(`Error clearing cache:`, error);
    }
  }
}

export default ClientCache;
