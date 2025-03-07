<template>
  <div class="relative overflow-hidden">
    <input
      class="absolute top-0 right-0 bottom-0 left-0 cursor-pointer opacity-0"
      type="file"
      ref="fileInput"
      @change="UploadFlow"
    />
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const props = defineProps<{
  onSuccess?: () => void;
  onUpload?: (data) => any;
  onFailed?: (error: string) => void;
}>();

const fileInput = ref<HTMLInputElement | null>(null);
const fileBase64 = ref<string | null>(null);
const fileType = ref<string | null>(null);
const document = ref<File | null>(null);

const onFileChange = async (event: Event) => {
  return new Promise((resolve, reject) => {
    const target = event.target as HTMLInputElement;
    const file = target.files ? target.files[0] : null;
    if (file) {
      fileType.value = file.type;
      document.value = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        fileBase64.value = e.target?.result as string;
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
