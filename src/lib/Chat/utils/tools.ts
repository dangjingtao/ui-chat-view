import _ from "lodash";
import toolsSet from "../tools/interface";

export const getTools = ({ client, embeddingClient, inputTools }) => {
  // 找到匹配的项
  const commonItems = _.intersectionWith(toolsSet, inputTools, (a, b) => {
    return a.name === (b as any).name && a.version === (b as any).version;
  });

  // 创建 Function 实例
  const tools = commonItems.map((item) => {
    const { name, Function, inputSchema } = item;
    const inputTool = inputTools.find((tool) => tool.name === name);

    if (name === "WebBrowser") {
      const { onSuccess, onCreated, onFailed } = inputTool.props;
      if (!client) {
        throw new Error("Client not initialized");
      }
      return new Function({
        model: client,
        embeddings: embeddingClient,
        onSuccess,
        onCreated,
        onFailed,
      });
    }

    if (name === "TavilySearch") {
      const { onSuccess, onCreated, onFailed } = inputTool.props;
      if (!client) {
        throw new Error("Client not initialized");
      }
      return new Function({
        maxResults: 2,
        apiKey: "",
        onSuccess,
        onCreated,
        onFailed,
      });
    }

    if (name === "MCPTestTool") {
      const { onSuccess, onCreated, onFailed } = inputTool.props;
      if (!client) {
        throw new Error("Client not initialized");
      }
      return new Function({
        apiKey: "",
        onSuccess,
        onCreated,
        onFailed,
      });
    }

    return new Function({});
  });

  return tools;
};
