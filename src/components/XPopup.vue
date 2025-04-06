<template>
  <transition name="slide-up">
    <div
      v-if="visible"
      class="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-gray-50"
    >
      <div
        class="relative m-auto h-full w-full overflow-hidden bg-white shadow-lg lg:w-[1440px]"
      >
        <button
          @click="close"
          class="absolute top-0 right-2 cursor-pointer text-4xl text-gray-500 hover:text-gray-900"
        >
          &times;
        </button>
        <div class="h-full overflow-auto px-6">
          <slot></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref } from "vue";

const visible = ref(false);

function open() {
  visible.value = true;
}

function close() {
  visible.value = false;
}

defineExpose({ open, close });
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.2s;
}
.slide-up-enter-from {
  transform: translateY(100%);
}
.slide-up-leave-to {
  transform: translateY(100%);
}
</style>
