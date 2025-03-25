<template>
  <div class="flex h-full flex-col">
    <div class="pb-5">
      <div
        class="bg-primary-1 relative flex justify-center rounded-md px-3 py-1"
      >
        <button
          v-for="(tab, index) in tabs"
          :key="index"
          :class="[
            'flex-1 cursor-pointer rounded-lg px-2 py-0.5 text-center text-sm text-gray-700 transition-all duration-100',
            selectedTab === index
              ? 'text-primary dark:bg-primary-8 bg-white shadow-xs dark:text-white'
              : 'bg-transparent',
          ]"
          @click="selectTab(index)"
        >
          {{ tab }}
        </button>
      </div>
    </div>
    <transition name="fade" mode="out-in">
      <div class="flex-1 overflow-auto pb-1" :key="selectedTab">
        <slot :name="`tab-${selectedTab}`"></slot>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  tabs: string[];
}>();

const selectedTab = ref(0);
const previousTab = ref(0);

const selectTab = (index: number) => {
  previousTab.value = selectedTab.value;
  selectedTab.value = index;
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>
