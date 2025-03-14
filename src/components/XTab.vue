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
            'text-md flex-1 rounded-lg px-2 py-0.5 text-center text-gray-700 transition-all duration-100',
            selectedTab === index ? 'bg-white shadow' : 'bg-transparent',
          ]"
          @click="selectTab(index)"
        >
          {{ tab }}
        </button>
      </div>
    </div>
    <transition :name="transitionName" mode="out-in">
      <div class="flex-1 overflow-auto pb-5" :key="selectedTab">
        <slot :name="`tab-${selectedTab}`"></slot>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const props = defineProps<{
  tabs: string[];
}>();

const selectedTab = ref(0);
const previousTab = ref(0);

const selectTab = (index: number) => {
  previousTab.value = selectedTab.value;
  selectedTab.value = index;
};

const transitionName = computed(() => {
  return selectedTab.value > previousTab.value ? "slide-left" : "slide-right";
});
</script>

<style scoped>
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.1s ease;
}
.slide-left-enter,
.slide-right-leave-to {
  transform: translateX(100%);
}
.slide-left-leave-to,
.slide-right-enter {
  transform: translateX(-100%);
}
</style>
