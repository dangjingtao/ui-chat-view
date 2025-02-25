export default function parseString(input) {
  const infoPattern = /(\w+)\[([^\]]+)\]/g;
  const contentPattern = /(?:\w+\[[^\]]+\]\s*)*(.*)/;

  let match;
  const infoArray: { name: string; props: { [key: string]: string } }[] = [];

  while ((match = infoPattern.exec(input)) !== null) {
    const name = match[1];
    const propsString = match[2];
    const props = {};

    propsString.split(" ").forEach((prop) => {
      const [key, value] = prop.split("=");
      props[key] = value;
    });

    infoArray.push({ name, props });
  }

  const contentMatch = contentPattern.exec(input);
  const content = contentMatch ? contentMatch[1].trim() : "";

  return {
    infoArray,
    content,
  };
}


