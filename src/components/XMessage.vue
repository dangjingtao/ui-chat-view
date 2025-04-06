<template>
  <transition name="slide">
    <div v-if="isVisible" :class="alertClasses" role="alert">
      <slot></slot>
      <a
        v-if="dismissible"
        type="text"
        size="small"
        class="ml-auto h-5 w-5 cursor-pointer rounded-full p-0 text-center text-lg leading-4 text-red-600 hover:bg-red-200"
        @click="closeAlert"
      >
        &times;
      </a>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";

type MessageType = {
  type?: "success" | "danger" | "warning" | "info" | undefined;
  dismissible?: boolean;
};

type Message = Omit<MessageType, "dismissible"> & {
  code?: string | number;
  content: string;
};

const props = defineProps<MessageType>();
const emits = defineEmits(["close"]);

const isVisible = ref(true);

const alertClasses = computed(() => {
  const baseClasses =
    "flex w-full items-center py-2 px-4 text-sm rounded-md origin-top-left transition-all";
  const typeClasses = {
    success: "bg-green-100 text-green-700 border border-green-200",
    danger: "bg-red-100 text-red-700 border border-red-200",
    warning: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    info: "bg-blue-100 text-blue-700 border border-blue-200",
  };
  return `${baseClasses} ${typeClasses[props.type || "info"]}`;
});

const closeAlert = () => {
  isVisible.value = false;
  emits("close");
};
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.1s;
}
.slide-enter,
.slide-leave-to {
  transform: translateY(-5px);
  /* opacity: 0; */
}
button {
  background: none;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  color: inherit;
  padding: 0 0.5rem;
  transition: color 0.3s ease;
}
</style>
