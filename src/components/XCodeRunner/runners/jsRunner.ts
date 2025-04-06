import { CodeBlock, RunResult } from "../types";
import { WebContainer } from "@webcontainer/api";

// 全局缓存 WebContainer 实例
let webcontainerInstance: WebContainer | null = null;

async function initWebContainer(): Promise<WebContainer> {
  if (!window.webcontainerInstance) {
    window.webcontainerInstance = await WebContainer.boot();
    webcontainerInstance = window.webcontainerInstance;
  } else {
    webcontainerInstance = window.webcontainerInstance;
  }
  //使用json的方式初始化文件目录
  const initFiles = {
    "README.md": {
      file: {
        contents: `这是一个基于webcontainer的demo`,
      },
    },
  };
  if (!window.webcontainerInstance) {
    await webcontainerInstance.mount(initFiles);
  }

  await webcontainerInstance.fs.writeFile("/main.js", ``, {
    encoding: "utf-8",
  });
  return webcontainerInstance;
}

export const jsRunner = {
  async run(blocks: CodeBlock[]): Promise<RunResult> {
    const result: RunResult = { text: "" };
    const tsModule = await import("typescript");

    // 合并代码
    let js = "";
    blocks.forEach((block) => {
      if (block.language === "javascript") js += block.code;

      if (block.language === "typescript") {
        js += tsModule.transpileModule(block.code, {
          compilerOptions: { target: tsModule.ScriptTarget.ESNext },
        }).outputText;
      }
    });

    const instance = await initWebContainer();
    await instance.fs.writeFile("/main.js", js, { encoding: "utf-8" });

    // 运行代码
    const process = await instance.spawn("node", ["main.js"]);

    // 捕获输出
    const logs: string[] = [];
    process.output.pipeTo(
      new WritableStream({
        write(chunk) {
          logs.push(chunk);
        },
      }),
    );

    // 等待执行完成
    const exitCode = await process.exit;
    if (exitCode !== 0) {
      logs.push(`ERROR: Process exited with code ${exitCode}`);
    }

    result.text = logs.join("\n");

    return result;
  },
};
