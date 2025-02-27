<template>
  <div class="markdown-body" v-html="markdownContent"></div>
</template>

<script setup lang="ts">
import { defineProps, computed, ref } from "vue";
import MarkdownIt from "markdown-it";
import hljs_plugin from "markdown-it-highlightjs";

const props = defineProps<{ content: string }>();
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
}).use(hljs_plugin);

const markdownContent = computed(() => {
  return md.render(props.content);
});
</script>
<style scoped>
.markdown-body:not(.user-markdown) {
  box-sizing: border-box;
  min-width: 200px;
  max-width: 980px;
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
