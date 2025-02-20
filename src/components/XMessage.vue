<template>
  <div v-if="isVisible" :class="alertClasses" role="alert">
    <slot></slot>
    <button
      v-if="dismissible"
      type="button"
      class="ml-auto"
      @click="closeAlert"
    >
      &times;
    </button>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, defineProps } from "vue";

type MessageType = {
  type?: "success" | "danger" | "warning" | "info" | undefined;
  dismissible: boolean;
};

export type Message = Omit<MessageType, "dismissible"> & {
  code?: string | number;
  content: string;
};

const props = defineProps<MessageType>();

const isVisible = ref(true);

const alertClasses = computed(() => {
  const baseClasses = "flex w-full items-center py-1 px-2 text-sm";
  const typeClasses = {
    success: "bg-green-100 text-green-700",
    danger: "bg-red-100 text-red-700",
    warning: "bg-yellow-100 text-yellow-700",
    info: "bg-blue-100 text-blue-700",
  };
  return `${baseClasses} ${typeClasses[props.type || "info"]}`;
});

const closeAlert = () => {
  isVisible.value = false;
};
</script>

<style scoped>
button {
  background: none;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
}
</style>
