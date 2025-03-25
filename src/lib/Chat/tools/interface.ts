import { z } from "zod";
import calculatorTool from "./calculator";
import { TavilySearchResults } from "./baseTools/TavilySearch";
import { WebBrowser } from "./baseTools/WebBrowser";

// 写一套模拟MCP协议
export default [
  {
    name: "WebBrowser",
    description: `useful for when you need to find something on or summarize a webpage. input should be a comma separated list of "ONE valid http URL including protocol","what you want to find on the page or empty string for a summary".`,
    version: "1.0.0",
    Function: WebBrowser,
    inputSchema: {
      type: "object",
      properties: {
        a: { type: "ChatClient" },
        b: { type: "EmbeddingClient" },
        onCreated: { type: "function" },
        onSuccess: { type: "function" },
        onError: { type: "function" },
      },
      required: ["a", "b"],
    },
  },
  {
    name: "TavilySearch",
    version: "1.0.0",
    Function: TavilySearchResults,
    inputSchema: {
      type: "object",
      properties: {
        maxResults: { type: "number" },
      },
      required: ["maxResults"],
    },
  },
];
