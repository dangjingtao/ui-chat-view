<template>
  <div
    id="terminal"
    ref="terminalContainer"
    class="h-fll w-full overflow-auto bg-slate-700 px-2 py-1 dark:bg-slate-200"
  >
    <div
      class="leading-5"
      v-for="terminalMessage in terminalMessages"
      v-html="terminalMessage"
    ></div>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch } from "vue";

const terminalMessages = ref<string[]>([]);
const terminalContainer = ref<HTMLElement | null>(null);

const scrollToBottom = () => {
  if (terminalContainer.value) {
    terminalContainer.value.scrollTop = terminalContainer.value.scrollHeight;
  }
};

watch(
  terminalMessages,
  () => {
    scrollToBottom();
  },
  { deep: true },
);

const utils = {
  addTerminalMessage(message) {
    terminalMessages.value.push(message);
  },
  success(msg) {
    this.addTerminalMessage(
      `<span class="text-green-400">[Success]</span> ${msg}`,
    );
  },
  error(msg) {
    this.addTerminalMessage(`<span class="text-red-400">[Error]</span> ${msg}`);
  },
  warning(msg) {
    this.addTerminalMessage(
      `<span class="text-yellow-400">[Warning]</span> ${msg}`,
    );
  },
  info(msg) {
    this.addTerminalMessage(`<span class="text-blue-400">[Info]</span> ${msg}`);
  },
  rewrite({ msg, type }) {
    terminalMessages.value = terminalMessages.value.slice(
      0,
      terminalMessages.value.length - 1,
    );
    this[type](msg);
  },
  clear() {
    terminalMessages.value = [];
  },
};

defineExpose(utils);
</script>

<style scoped>
#terminal {
  font-family: Consolas, "Courier New", monospace, "Fira Code", monospace;
  font-size: 14px;
  line-height: 1.4;
  background: #1d293d;
  color: #c3c3c3;
  padding: 10px;
  border-radius: 5px;
}
</style>
