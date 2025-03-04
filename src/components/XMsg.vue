<template>
  <div
    v-if="visible"
    :class="[
      'fixed top-4 left-1/2 z-50 -translate-x-1/2 transform rounded border p-2 shadow-xs transition-opacity duration-300',
      typeClass,
    ]"
    @animationend="handleAnimationEnd"
    @click="handleClick"
    class="slide-down"
  >
    <div class="flex items-center">
      <span :class="iconClass" class="mr-2"></span>
      <span class="text-sm">{{ message }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

const props = defineProps({
  type: {
    type: String,
    default: "info",
    validator: (value: string) =>
      ["info", "warning", "success", "error"].includes(value),
  },
  message: {
    type: String,
    required: true,
  },
});

const visible = ref(true);

const typeClass = computed(() => {
  return {
    "bg-blue-100 text-blue-700 border-blue-400": props.type === "info",
    "bg-yellow-100 text-yellow-700 border-yellow-400": props.type === "warning",
    "bg-green-100 text-green-700 border-green-400": props.type === "success",
    "bg-red-100 text-red-700 border-red-400": props.type === "error",
  };
});

const iconClass = computed(() => {
  return {
    "icon-info": props.type === "info",
    "icon-warning": props.type === "warning",
    "icon-success": props.type === "success",
    "icon-error": props.type === "error",
  };
});

onMounted(() => {
  setTimeout(() => {
    visible.value = false;
  }, 3000);
});

function handleClick() {
  visible.value = false;
}

function handleAnimationEnd() {
  if (!visible.value) {
    // 这里可以触发一个事件，通知父组件消息已经消失
  }
}
</script>

<style scoped>
@keyframes slide-down {
  0% {
    transform: translateY(-100%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.slide-down {
  animation: slide-down 0.3s ease-out;
}

.icon-info::before {
  content: "ℹ️";
}

.icon-warning::before {
  content: "⚠️";
}

.icon-success::before {
  content: "✔️";
}

.icon-error::before {
  content: "❌";
}
</style>
