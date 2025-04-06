import _ from "lodash";
import toolsSet from "../tools/interface";
import CommonError from "@/lib/CommonError";
import { AIMessage } from "@langchain/core/messages";
import { RunnableLambda } from "@langchain/core/runnables";
import type Chat from "../index";
import type { MicroChat } from "../microChat";

// 获取工具
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

// 工具调用节点
export const withCallTools = (chatInstance: Chat | MicroChat) =>
  new RunnableLambda({
    func: async (state: AIMessage, ..._args: any[]): Promise<any> => {
      const { tool_calls = [] } = state;
      console.log("Processing state:", tool_calls);

      if (tool_calls.length) {
        try {
          // 使用 Promise.allSettled 并行处理工具调用
          const toolMessages = await Promise.allSettled(
            tool_calls.map(async (toolCall) => {
              const selectedTool = chatInstance.tools.find(
                (item) => item.name === toolCall.name,
              );
              if (selectedTool) {
                return selectedTool.invoke(toolCall);
              } else {
                throw new CommonError(`Tool not found: ${toolCall.name}`);
              }
            }),
          );

          // 处理工具调用结果
          const fulfilledToolMessages = toolMessages
            .filter((result) => result.status === "fulfilled")
            .map((result) => (result as PromiseFulfilledResult<any>).value);

          const rejectedToolMessages = toolMessages
            .filter((result) => result.status === "rejected")
            .map((result) => (result as PromiseRejectedResult).reason);

          if (rejectedToolMessages.length) {
            console.warn("Some tool calls failed:", rejectedToolMessages);
          }

          const chatHistory = await chatInstance.getFormatChatHistory();
          chatHistory.push(state);
          chatHistory.push(...fulfilledToolMessages);

          if (!chatInstance) {
            throw new CommonError("Chat instance is not available.");
          }
          //@ts-ignore
          return await chatInstance.client.invoke(chatHistory);
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.error("Error:", error.message);
          } else {
            console.error("Unknown error:", error);
          }
          throw error; // 重新抛出错误以便调用方处理
        }
      }
      console.log("No Tool use:", state);
      return state;
    },
  });
