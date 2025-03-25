<template>
  <div
    ref="markdownContainer"
    class="markdown-body"
    v-html="markdownContent"
  ></div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js/lib/common";

const markdownContainer = ref(null);

const props = defineProps<{
  content: string;
  onRenderComplete?: (el: HTMLElement | null) => void;
}>();

onMounted(() => {
  if (props.onRenderComplete) {
    props.onRenderComplete(markdownContainer.value);
  }
});

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
  // highlight: function (code, { language }) {
  //   try {
  //     return hljs.highlight(code, { language }).value;
  //   } catch (__) {}

  //   return ""; // 使用额外的默认转义
  // },
});

// 计算最终要显示的 html 文本

const markdownContent = computed(() => {
  return md.render(props.content);
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
