import Base from "./Base";

// MCP服务器的curd
export default class extends Base {
  async getMCPServers() {
    const { cache } = this;
    return (await cache.get("MCPServers")) || [];
  }

  async addMCPServer(record) {
    const { cache } = this;
    const formatRecord = this.generateNewDataMeta(record);
    const records = (await this.getMCPServers()) || [];
    await cache.set("MCPServers", [...records, formatRecord]);
  }

  async deleteMCPServer(id) {
    const { cache } = this;
    const records = (await this.getMCPServers()) || [];
    const newRecords = records.filter((item) => item.id !== id);
    await cache.set("MCPServers", newRecords);
  }

  async updateMCPServer(id, record) {
    const { cache } = this;
    const records = (await this.getMCPServers()) || [];
    const newRecords = records.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          ...record,
        };
      }
      return item;
    });
    await cache.set("MCPServers", newRecords);
  }
}
