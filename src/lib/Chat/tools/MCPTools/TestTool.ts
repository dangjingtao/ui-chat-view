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
  }
}

export default MCPTestTool;
