// utils/blobUtils.js
export function base64ToBlob(base64, mimeType = "") {
  const byteString = atob(base64.split(",")[1]);
  const byteArray = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    byteArray[i] = byteString.charCodeAt(i);
  }
  return new Blob([byteArray], { type: mimeType });
}

export async function generateBlobURL(audioURL) {
  try {
    const response = await fetch(audioURL);
    if (!response.ok) throw new Error("网络请求失败");
    const audioBlob = await response.blob();
    return URL.createObjectURL(audioBlob);
  } catch (error) {
    console.error("生成 Blob URL 时出错:", error);
    throw error;
  }
}
