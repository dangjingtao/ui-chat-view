<template>
  <div
    class="w-full"
    :class="{
      'cursor-pointer': !isViewerOpen,
      'cursor-default': isViewerOpen,
    }"
  >
    <div class="w-full" @click="openViewer">
      <slot></slot>
    </div>
    <transition>
      <div
        v-show="isViewerOpen"
        class="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div
          @click="closeViewer"
          class="absolute inset-0 bg-black opacity-75"
        ></div>
        <img
          :src="props.src"
          :style="{ transform: `scale(${scale})` }"
          @wheel="onWheel"
          class="z-10 max-h-full max-w-full transition-transform"
        />
        <div
          @click="closeViewer"
          class="absolute top-0 right-0 z-20 h-10 w-10 transform cursor-pointer text-center text-2xl leading-8 text-white transition-transform hover:scale-125"
        >
          &times;
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const props = defineProps<{
  src: string;
}>();

const isViewerOpen = ref(false);
const scale = ref(1);

const openViewer = () => {
  isViewerOpen.value = true;
};

const closeViewer = () => {
  isViewerOpen.value = false;
  scale.value = 1;
};

const onWheel = (event: WheelEvent) => {
  if (event.deltaY < 0) {
    scale.value += 0.1;
  } else {
    scale.value = Math.max(0.1, scale.value - 0.1);
  }
};
</script>

<style scoped>
img {
  transition: transform 0.2s;
}

.v-enter-active,
.v-leave-active {
  transition:
    opacity 0.1s ease,
    transform 0.1s;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.1s,
    transform 0.1s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
