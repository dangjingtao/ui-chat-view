<template>
  <div class="code-runner border-gray-300">
    <div
      class="flex items-center justify-between rounded-t-md border border-b border-gray-300 px-2 py-1"
    >
      <div class="text-sm font-bold text-gray-600">UI Chat Code Runner</div>
      <div>
        <x-button @click="reset" type="text" class="ml-2">Reset</x-button>
        <x-button @click="run" type="text" class="ml-2">Run</x-button>
      </div>
    </div>

    <x-message v-if="loading" type="info">Loading Runtime...</x-message>
    <div
      :class="{
        'rounded-b-md border-r border-b border-l border-gray-300':
          isFrontEndMode,
      }"
      class="output"
      :style="{ height }"
    >
      <div
        v-if="isFrontEndMode"
        ref="outputRef"
        class="h-full w-full overflow-auto"
      ></div>
      <x-terminal
        v-if="!isFrontEndMode"
        ref="terminalRef"
        class="h-full rounded-tl-[0px] rounded-tr-[0px]"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { htmlCssJsRunner } from "./runners/htmlCssJsRunner";
import { pythonRunner } from "./runners/pythonRunner";
import { jsRunner } from "./runners/jsRunner";
import { parseMarkdown } from "./utils/markdownParser";
import { exportToZip } from "./utils/zipExporter";
import { CodeInput, RunResult, CodeBlock, DownloadOptions } from "./types";

const terminalRef = ref<HTMLElement | null>(null);
const outputRef = ref<HTMLElement | null>(null);
const isFrontEndMode = ref(false);

// Props 和 Emits
const props = defineProps<{
  input: CodeInput;
  terminalMode?: boolean;
  height?: string;
}>();
const emit = defineEmits<{
  (e: "on-success", result: RunResult): void;
  (e: "on-error", error: string): void;
  (e: "on-update", output: string): void;
}>();

// 状态
const loading = ref(false);

// 运行器映射
const runners = {
  html: htmlCssJsRunner,
  css: htmlCssJsRunner,
  javascript: jsRunner,
  typescript: jsRunner,
  python: pythonRunner,
  // java: javaRunner,
};

// 运行代码
const run = async () => {
  loading.value = true;
  try {
    const blocks = props.input.markdown
      ? parseMarkdown(props.input.markdown)
      : [
          {
            language: props.input.language!,
            code: props.input.code!,
          },
        ];

    const isFrontend = blocks.some((b) => b.language === "html");
    isFrontEndMode.value = isFrontend;
    if (outputRef.value) {
      outputRef.value.innerHTML = "";
    }
    const runner = isFrontend ? htmlCssJsRunner : runners[blocks[0].language];

    const result = await runner.run(isFrontend ? blocks : [blocks[0]]);
    console.log("run", blocks, runner, result);

    if (result.rendered && outputRef.value) {
      outputRef.value.appendChild(result.rendered);
    } else {
      // terminalRef.value?.scrollTo(0, terminalRef.value.scrollHeight);
      terminalRef.value?.log(result.text);
    }
    emit("on-success", result);
    emit("on-update", result.text);
  } catch (e) {
    emit("on-error", (e as Error).message);
  } finally {
    loading.value = false;
  }
};

// 重置
const reset = () => {
  if (!isFrontEndMode.value && terminalRef.value) {
    terminalRef.value?.clear();
  } else if (outputRef.value) {
    outputRef.value.innerHTML = "";
  }
};

// 下载
const download = (options?: DownloadOptions) => {
  const blocks = props.input.markdown
    ? parseMarkdown(props.input.markdown)
    : [
        {
          language: props.input.language!,
          code: props.input.code!,
        },
      ];
  exportToZip(blocks, options);
};

// 暴露方法
defineExpose({ run, reset, parseMarkdown, download });
</script>

<style scoped>
.code-runner {
  display: flex;
  flex-direction: column;
}
.output {
  border: 1px solid #ccc;
  overflow: auto;
}
.loading {
  text-align: center;
  padding: 10px;
}
</style>
