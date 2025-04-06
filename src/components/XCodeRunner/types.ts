// 输入接口
export interface CodeInput {
  markdown?: string;
  code?: string;
  language?: "html" | "css" | "javascript" | "typescript" | "python" | "java";
}

// 代码块
export interface CodeBlock {
  language: "html" | "css" | "javascript" | "typescript" | "python" | "java";
  code: string;
}

// 运行结果
export interface RunResult {
  rendered?: HTMLElement | null;
  text: string;
}

// 下载选项
export interface DownloadOptions {
  filename?: string;
  includeOutput?: boolean;
}
