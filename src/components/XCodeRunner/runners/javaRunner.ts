import { RunResult } from "../types";

export const javaRunner = {
  async run(code: string): Promise<RunResult> {
    const cheerpj = await import("cheerpj"); // 假设有此模块
    await cheerpj.cheerpjInit();
    // CheerpJ 的具体实现待完善
    const output = "Java output placeholder"; // 占位
    return { text: output };
  },
};
