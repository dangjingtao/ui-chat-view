import request from "./request";

export async function requestGithubFileContent({
  owner = "dangjingtao",
  repo = "ui-chat-view",
  branch = "main",
  filePath,
}) {
  const url = `/github-api/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`;

  const headers = {
    Accept: "application/vnd.github.v3+json",
  };

  const { data } = await request({
    method: "GET",
    url,
    headers,
  });

  const decodedContent = atob(data.content);
  const textDecoder = new TextDecoder("utf-8");
  return textDecoder.decode(
    new Uint8Array([...decodedContent].map((char) => char.charCodeAt(0))),
  );
}

export async function requestAppVersion() {
  return JSON.parse(
    await requestGithubFileContent({ filePath: "package.json" }),
  ).version;
}
