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
