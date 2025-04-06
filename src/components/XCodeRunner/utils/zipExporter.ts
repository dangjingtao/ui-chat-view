import JSZip from "jszip";
import { saveAs } from "file-saver";
import { CodeBlock, DownloadOptions } from "../types";

export function exportToZip(
  blocks: CodeBlock[],
  options: DownloadOptions = {},
) {
  const zip = new JSZip();
  const { filename = "code.zip", includeOutput = false } = options;

  blocks.forEach((block) => {
    const ext =
      block.language === "html"
        ? "html"
        : block.language === "css"
          ? "css"
          : "js";
    const name =
      block.language === "html"
        ? "index.html"
        : block.language === "css"
          ? "styles.css"
          : `script.${block.language}`;
    zip.file(name, block.code);
  });

  // TODO: 如果 includeOutput 为 true，添加运行结果
  zip.generateAsync({ type: "blob" }).then((blob) => {
    saveAs(blob, filename);
  });
}
