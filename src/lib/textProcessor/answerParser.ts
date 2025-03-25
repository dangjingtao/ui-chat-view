import DOMPurify from "dompurify";

export const formatContent = (content) => {
  // 将转义符号转换为相应的 HTML 标签
  const formattedContent = content
    .replace(/\n/g, "<br>")
    .replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;");
  // 使用 DOMPurify 来清理和转义 HTML 内容
  return DOMPurify.sanitize(formattedContent);
};

export const extractThinkContent = (text: string): string[] => {
  const regex = /<think>(.*?)<\/think>/gs;
  const matches: string[] = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    matches.push(match[1]);
  }
  return matches;
};

export const removeThinkContent = (content) => {
  if (typeof content !== "string") {
    return content;
  }
  return content.replace(/<think>.*?<\/think>/gs, "");
};

export const hasThinkContent = (content: string) => {
  return extractThinkContent(content).length > 0;
};

export default (input) => {
  const regex = /(\w+)\[([^\]]*)\]/g;
  const infoArray: { name: string; props: { [key: string]: string } }[] = [];
  let content = input;
  let match;

  while ((match = regex.exec(input)) !== null) {
    const name = match[1];
    const propsString = match[2];
    const props = {};

    propsString.split(" ").forEach((prop) => {
      const [key, value] = prop.split("=");
      props[key] = value;
    });

    infoArray.push({ name, props });
    content = content.replace(match[0], "").trim();
  }

  return { infoArray, content };
};
