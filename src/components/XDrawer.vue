<template>
  <!-- Mask -->
  <transition
    enter-active-class="transition-opacity"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity"
    leave-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-show="props.menuOpen"
      class="absolute inset-0 z-40 bg-black/50"
      @click="toggleMenu"
    ></div>
  </transition>

  <!-- Drawer -->
  <transition
    enter-active-class="transition-transform"
    enter-from-class="translate-x-full"
    enter-to-class="translate-x-0"
    leave-active-class="transition-transform"
    leave-class="translate-x-0"
    leave-to-class="translate-x-full"
  >
    <div
      v-show="menuOpen"
      class="absolute top-0 right-0 z-50 flex h-full justify-end"
    >
      <div class="z-50 h-full w-64 bg-white shadow-lg">
        <!-- Drawer content -->
        <div class="flex h-full flex-col gap-2.5 p-4">
          <div v-if="$slots.header" class="h-10">
            <slot name="header"></slot>
          </div>
          <div v-if="$slots.content" class="flex-1 overflow-auto">
            <slot name="content"></slot>
          </div>
          <div v-if="$slots.footer" class="h-8">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { defineProps, watch } from "vue";

const props = defineProps({
  menuOpen: Boolean,
  toggleMenu: Function,
});
</script>
