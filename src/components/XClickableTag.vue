<template>
  <div @click="onClick" :class="classResult">
    {{ props.text }}
    <div
      v-if="!!isActived && props.closable"
      class="hover:bg-primary-2 m-auto ml-1 block rounded-full p-1"
      @click="onClose"
    >
      <i-mdi-close />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const props = defineProps<{
  text: string;
  icon?: string;
  class?: string;
  isActived?: boolean;
  closable?: boolean;
}>();

const isActived = computed(() => props.isActived || false);
const emits = defineEmits(["click", "close"]);

const onClick = () => {
  emits("click", isActived.value);
};
const onClose = (e) => {
  e.preventDefault();
  e.stopPropagation();

  emits("close");
};

const classResult = computed(() => [
  "text-primary hover:bg-primary-1 flex h-7 transition-all duration-100 ease-in-out cursor-pointer gap-1 rounded px-2 text-xs leading-7",
  isActived.value ? "bg-primary-1" : "bg-white",
  props.class,
]);
</script>
