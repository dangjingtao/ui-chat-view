import request from "@/lib/request";
// import { tool } from "@langchain/core/tools";
// import { z } from "zod";

import { Tool, ToolParams } from "@langchain/core/tools";
import {
  CallbackManager,
  CallbackManagerForToolRun,
} from "@langchain/core/callbacks/manager";
import { joke } from "./construct";

export class MCPTestTool extends Tool {
  name = "MCPTestTool";

  description = `useful for when you need to find information you're unsure about; the input should be a noun or an event.`;

  schema = joke;

  static lc_name() {
    return "MCPTestTool";
  }

  get lc_namespace() {
    return [...super.lc_namespace, "MCPTestTool"];
  }

  constructor({ onCreated, onSuccess, onFailed }: any) {
    super(...arguments);

    const emptyFunctionCall = () => {};

    //@ts-ignore
    this.onSuccess = onSuccess || emptyFunctionCall;
    this.onCreated = onCreated || emptyFunctionCall;
    this.onFailed = onFailed || emptyFunctionCall;
  }

  /** @ignore */
  async _call(inputs: string, runManager?: CallbackManagerForToolRun) {
    console.log("MCPTestTool inputs===>", inputs);

    const { data } = await request({
      url: `http://127.0.0.1:8462/api/mcp/run`,
      method: "POST",
      data: {
        mcpPackageName: "@executeautomation/playwright-mcp-server",
        inputs,
      },
    });

    return data.content[0].text;

    // return "模型上下文协议（Model Context Protocol，简称MCP）。这一新标准旨在将人工智能助手与数据存储系统无缝连接，包括内容仓库、商业工具和开发环境，帮助前沿模型产出更精准的相关响应。";
    // const [url, query] = inputs.split(",");
    // const res = await fetch(url);
    // const text = await res.text();
    // const summary = await summarize(text, query);
  }
}

export default MCPTestTool;
