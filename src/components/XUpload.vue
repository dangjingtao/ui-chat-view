<template>
  <div
    class="absolute top-0 right-0 bottom-0 left-0 z-10 h-full w-full overflow-hidden"
  >
    <slot></slot>
    <input
      class="absolute top-0 right-0 bottom-0 left-0 z-10 block h-full w-full cursor-pointer opacity-0"
      type="file"
      ref="fileInput"
      @change="UploadFlow"
      :accept="accept"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import Compressor from "compressorjs";

const isImageFile = (file: File): boolean => {
  return file.type.startsWith("image/");
};

const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      maxWidth: 500,
      maxHeight: 500,
      quality: 0.3,
      success(result) {
        resolve(result);
      },
      error(err) {
        console.error(err.message);
        reject(err);
      },
    });
  });
};

const props = defineProps<{
  onSuccess?: () => void;
  onUpload?: (data) => any;
  onFailed?: (error: string) => void;
  accept?: string;
}>();

const fileInput = ref<HTMLInputElement | null>(null);
const fileBase64 = ref<string | null>(null);
const fileType = ref<string | null>(null);
const document = ref<File | null>(null);

const onFileChange = async (event: Event) => {
  return new Promise(async (resolve, reject) => {
    const target = event.target as HTMLInputElement;
    let file = target.files ? target.files[0] : null;
    if (file) {
      // 图片压缩处理
      if (isImageFile(file)) {
        file = await compressImage(file);
      }

      // 如果 file.type 为空，根据扩展名推断类型
      fileType.value = file.type || "";
      if (!fileType.value) {
        const extension = file.name.toLowerCase().split(".").pop();
        if (extension === "md") {
          fileType.value = "text/markdown";
        } else if (extension === "txt") {
          fileType.value = "text/plain";
        } else {
          fileType.value = "application/octet-stream"; // 兜底类型
        }
      }

      document.value = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        fileBase64.value = e.target?.result as string;
        console.log(fileBase64.value);
        resolve(fileBase64.value);
      };
      reader.onerror = (e) => {
        reject(new Error("文件读取失败"));
      };
      reader.readAsDataURL(file);
    } else {
      reject(new Error("未选择文件"));
    }
  });
};

const onUpload = async () => {
  if (!fileBase64.value || !fileType.value) {
    throw new Error("文件类型或Base64为空");
  }

  let uploadResult = {
    message: "success",
    error: null,
  };
  // 上传逻辑
  if (props.onUpload) {
    uploadResult = await props.onUpload({
      fileBase64: fileBase64.value,
      fileType: fileType.value,
      document: document.value,
    });
  }

  // 模拟上传成功
  props.onSuccess && uploadResult && (await props.onSuccess());

  // 上传失败
  props.onFailed && !uploadResult && (await props.onFailed(uploadResult));

  if (fileInput.value) {
    fileInput.value.value = "";
  }
  document.value = null;
  fileBase64.value = null;
  fileType.value = null;
};

const UploadFlow = async (event: Event) => {
  try {
    await onFileChange(event);
    await onUpload();
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      props.onFailed && props.onFailed(error.message);
    } else {
      props.onFailed && props.onFailed(String(error));
    }
  }
};
</script>

<style scoped>
/* 使用 Tailwind CSS 样式 */
</style>
