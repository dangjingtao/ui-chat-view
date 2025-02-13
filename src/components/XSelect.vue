<template>
  <div class="relative inline-block w-full min-w-[120px]">
    <div
      @click="toggleDropdown"
      class="focus:shadow-outline block w-full cursor-pointer rounded bg-white px-4 py-2 pr-8 leading-tight focus:outline-none"
    >
      {{ selectedValue || props.selectedValue || "Please Select" }}
      <div
        class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
      >
        <img :src="arrowSvg" class="h-4 w-4 fill-current" alt="Arrow Icon" />
      </div>
    </div>

    <transition
      :duration="{ enter: 50, leave: 50 }"
      enter-active-class="transition-opacity"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity"
      leave-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="absolute right-[-46px] z-10 mt-1 max-h-[500px] w-full min-w-[400px] overflow-auto rounded bg-white text-sm shadow-lg transition-opacity"
      >
        <div
          v-for="option in props.options"
          :key="option.id"
          @click="selectOption(option.id)"
          class="cursor-pointer px-4 py-1 hover:bg-gray-100"
          :class="option.id === selectedValue ? 'bg-gray-200' : ''"
        >
          {{ option.name }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, onMounted, watch, defineEmits } from "vue";
import arrowSvg from "@/assets/arrow.svg";

const props = defineProps({
  options: Array,
  selectedValue: String,
});

const emits = defineEmits(["onChange"]);

const isOpen = ref(false);

const selectedValue = ref("");

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const selectOption = (option) => {
  isOpen.value = false;
  selectedValue.value = option;
  emits("onChange", option);
};
</script>
