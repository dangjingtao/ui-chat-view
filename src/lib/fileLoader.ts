/**
 * 将 Markdown 或文本文档的 Base64 字符串转换为文本
 * @param base64 Base64 字符串，例如 "data:text/markdown;base64,MS4g5ouT5omR"
 * @returns 解码后的文本字符串
 * @throws 如果 Base64 格式无效或解码失败，抛出错误
 */
export function markdownTextLoader(base64: string): string {
  try {
    // 检查输入是否为有效的 Base64 字符串
    if (!base64 || !base64.includes("base64,")) {
      throw new Error("无效的 Base64 字符串格式");
    }

    // 提取纯 Base64 数据部分
    const base64Data = base64.split(",")[1];
    if (!base64Data) {
      throw new Error("Base64 数据为空");
    }

    // 解码 Base64 为二进制字符串
    const binaryString = atob(base64Data);

    // 将二进制字符串转换为 UTF-8 文本
    const text = new TextDecoder("utf-8").decode(
      Uint8Array.from(binaryString, (char) => char.charCodeAt(0)),
    );

    return text;
  } catch (error) {
    console.error("Markdown/Text Base64 解码失败:", error);
    throw error; // 抛出错误供调用者处理
  }
}

// // 示例用法
// try {
//   const markdownBase64 = "data:text/markdown;base64,MS4g5ouT5omR"; // "1. 标题"
//   const textBase64 = "data:text/plain;base64,SGVsbG8gV29ybGQ="; // "Hello World"

//   const markdownText = markdownTextLoader(markdownBase64);
//   console.log("Markdown 文本:", markdownText); // 输出: "1. 标题"

//   const plainText = markdownTextLoader(textBase64);
//   console.log("Text 文本:", plainText); // 输出: "Hello World"
// } catch (error) {
//   console.error("处理失败:", error.message);
// }
