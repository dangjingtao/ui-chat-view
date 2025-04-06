import { CodeBlock } from "../types";

export function parseMarkdown(markdown: string): CodeBlock[] {
  const blocks: CodeBlock[] = [];
  const lines = markdown.split("\n");
  let currentLanguage: string | null = null;
  let currentCode: string[] = [];

  for (const line of lines) {
    const match = line.match(/^```(\w+)/);
    if (match) {
      // 开始新代码块
      if (currentLanguage) {
        blocks.push({
          language: currentLanguage as any,
          code: currentCode.join("\n"),
        });
      }
      currentLanguage = match[1];
      currentCode = [];
    } else if (line === "```" && currentLanguage) {
      // 结束代码块
      blocks.push({
        language: currentLanguage as any,
        code: currentCode.join("\n"),
      });
      currentLanguage = null;
      currentCode = [];
    } else if (currentLanguage) {
      // 收集代码行
      currentCode.push(line);
    }
  }

  return blocks;
}
