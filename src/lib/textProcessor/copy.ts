import message from "@/lib/message";

const low_copy = async (directive) => {
  // 使用 document.execCommand 作为回退
  const textArea = document.createElement("textarea");
  textArea.value = directive;
  textArea.style.position = "fixed"; // 避免滚动到视图
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  document.execCommand("copy");
  document.body.removeChild(textArea);
};

const modern_copy = async (directive) => {
  // 使用 Clipboard API
  await navigator.clipboard.writeText(directive);
};

const copy = async (directive) => {
  try {
    await low_copy(directive);
    message.success(`复制成功。`);
  } catch (error) {
    message.error(`复制失败: ${error}`);
  }
};

export default copy;
