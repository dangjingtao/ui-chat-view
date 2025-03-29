<template>
  <div v-if="useTyped" ref="markdownContainer" class="markdown-body"></div>
  <div v-else class="markdown-body" v-html="markdownContent"></div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch, onUnmounted } from "vue";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js/lib/common";

import Typed from "typed.js";

const markdownContainer = ref(null);
const props = defineProps<{
  content: string;
  useTyped?: boolean;
}>();

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (__) {}
    }

    return ""; // 使用额外的默认转义
  },
});

// 计算最终要显示的 html 文本

const markdownContent = computed(() => {
  return md.render(props.content);
});

const typedInstance = ref<Typed | null>(null);

const typedConfig = {
  strings: [markdownContent.value], // 使用 MarkdownIt 渲染后的 HTML
  typeSpeed: 2,
  showCursor: false, // 可选：隐藏光标
  contentType: "html", // 重要：告诉 typed.js 内容是 HTML
};

onMounted(() => {
  if (props.useTyped) {
    typedInstance.value = new Typed(markdownContainer.value, typedConfig);
  }
});

watch(
  () => markdownContent.value,
  () => {
    if (props.useTyped) {
      typedInstance.value?.destroy();
      typedInstance.value = new Typed(markdownContainer.value, typedConfig);
    }
  },
);

onUnmounted(() => {
  // 清理 typed.js 实例
  typedInstance.value?.destroy();
});
</script>
<style scoped>
/* @import "@/styles/markdown.css"; */
.markdown-body:not(.user-markdown) {
  box-sizing: border-box;
  /* min-width: 200px; */
  max-width: 100%;
  margin: 0 auto;
  padding: 45px;
}
@media (max-width: 767px) {
  .markdown-body {
    padding: 15px;
  }
}
.user-markdown {
  background-color: inherit !important;
}
</style>
