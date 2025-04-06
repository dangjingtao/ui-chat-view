import { CodeBlock, RunResult } from "../types";

export const htmlCssJsRunner = {
  async run(blocks: CodeBlock[]): Promise<RunResult> {
    const result: RunResult = { text: "" };

    // 合并代码
    let html = "",
      css = "",
      js = "";
    blocks.forEach((block) => {
      if (block.language === "html") html += block.code;
      if (block.language === "css") css += block.code;
      if (block.language == "javascript") js += block.code;
    });

    // 解析 HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html || "<html></html>", "text/html");

    // 提取 <style> 和外部 CSS
    const headStyles = Array.from(doc.head.getElementsByTagName("style"))
      .map((style) => style.textContent)
      .join("\n");
    const combinedCss = `${css}\n${headStyles}`.trim();

    // 构建完整 HTML
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${combinedCss}</style>
        </head>
        <body>
          ${doc.body.innerHTML}
          <script>${js}</script>
        </body>
      </html>
    `;

    // 创建 Blob 和 URL
    const htmlBlob = new Blob([fullHtml], { type: "text/html" });
    const blobUrl = URL.createObjectURL(htmlBlob);

    // 创建 iframe
    const iframe = document.createElement("iframe");
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";

    // 等待 iframe 加载完成
    iframe.src = blobUrl; // 设置 src 触发加载
    iframe.onload = () => {
      console.log("iframe loaded with Blob URL");
      // resolve();
      URL.revokeObjectURL(blobUrl);
    };
    iframe.onerror = () => {
      result.text = "ERROR: Failed to load iframe content";
      // resolve(); // 即使出错也继续
      URL.revokeObjectURL(blobUrl);
    };

    result.rendered = iframe;
    return result;
  },
};
