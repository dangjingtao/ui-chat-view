import { RunResult } from "../types";

const PYODIDE_VERSION = "0.27.0";
const INDEX_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

// 单例模式缓存 Pyodide 实例
let pyodideInstance: any = null;

export const pythonRunner = {
  async run(code: string): Promise<RunResult> {
    try {
      if (!window.loadPyodide) {
        throw new Error(
          "Pyodide not loaded. Ensure pyodide.js is included in your HTML.",
        );
      }

      // 仅首次加载 Pyodide
      if (!pyodideInstance) {
        pyodideInstance = await window.loadPyodide({ indexURL: INDEX_URL });
      }

      // 执行 Python 代码
      await pyodideInstance.runPythonAsync(`
        import sys
        import io
        sys.stdout = io.StringIO()
        ${code}
        sys.stdout.getvalue()
      `);

      const output = pyodideInstance.runPython("sys.stdout.getvalue()");
      return { text: output };
    } catch (e) {
      throw new Error(`Python 运行失败: ${(e as Error).message}`);
    }
  },
};
