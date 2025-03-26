import {
  HumanMessage,
  SystemMessage,
  AIMessage,
  ToolMessage,
  trimMessages,
} from "@langchain/core/messages";
import { tiktokenCounter } from "./tokenCounter";
import type { ProviderName } from "../types";

// 格式化发送消息，处理图片，并且限制token数量(可选)
const formatChatHistory = async ({
  provider,
  chatHistory,
  maxTokens,
}: {
  provider: ProviderName;
  chatHistory: Array<{
    role: string;
    content?: string;
    image_url?: string;
    fileList?: any[];
  }>;
  maxTokens?: number;
}) => {
  const formattedChatHistory = chatHistory.map((item) => {
    if (item.role === "assistant") {
      return new AIMessage(item.content || "");
    } else if (item.role === "user") {
      // groq不支持图片
      if (provider === "groq" || provider === "cloudflare") {
        return new HumanMessage(item.content || "");
      }

      // 发送图片
      const userMessage: {
        content: Array<{
          type: string;
          text?: string;
          image_url?: { url: string };
        }>;
      } = {
        content: [
          {
            type: "text",
            text: item.content || "",
          },
        ],
      };
      const fileList = item.fileList || [];
      // console.error("item", fileList);

      if (fileList[0] && fileList[0]?.isImage) {
        userMessage.content.push({
          type: "image_url",
          image_url: {
            url: item.fileList[0].fileBase64,
          },
        });
      }

      return new HumanMessage(userMessage);
    } else {
      return item;
    }
  });

  return formattedChatHistory;

  const trimmedChatHistory = await trimMessages(formattedChatHistory, {
    maxTokens: maxTokens || 8000,
    strategy: "last",
    tokenCounter: tiktokenCounter,
  });

  return trimmedChatHistory;
};

export default formatChatHistory;
