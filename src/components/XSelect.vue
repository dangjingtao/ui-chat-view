<template>
  <div
    class="relative inline-block w-full max-w-[200px] min-w-[120px]"
    ref="dropdown"
  >
    <div
      @click="toggleDropdown"
      class="focus:shadow-outline transition-border block w-full cursor-pointer rounded border bg-white px-4 py-1 pr-8 text-sm leading-3.5 focus:outline-none"
      :class="isOpen ? 'border-gray-300' : 'border-gray-100'"
    >
      <span
        class="inline-block max-w-full truncate overflow-hidden py-1 text-ellipsis whitespace-nowrap"
        >{{ selectedName }}</span
      >

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
        class="absolute z-10 mt-2 overflow-auto rounded bg-white text-sm shadow-lg transition-opacity"
        :class="props.dropdownClass || 'w-full'"
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
import { ref, watch, onMounted, onBeforeUnmount, computed } from "vue";
import arrowSvg from "@/assets/arrow.svg";

interface Option {
  id: string;
  name: string;
}

const props = defineProps<{
  options: Option[];
  selectedValue: string;
  dropdownClass?: string;
}>();

const emits = defineEmits<{
  (e: "change", value: string): void;
}>();

const isOpen = ref(false);
const selectedValue = ref(props.selectedValue || "");
const dropdown = ref<HTMLElement | null>(null);

watch(
  () => props.selectedValue,
  (newValue) => {
    selectedValue.value = newValue;
  },
);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const selectOption = (option: string) => {
  isOpen.value = false;
  selectedValue.value = option;
  emits("change", option);
};

const selectedName = computed(() => {
  return (
    props.options.find((option) => option.id === selectedValue.value)?.name ||
    "Please Select"
  );
});

const handleClickOutside = (event: MouseEvent) => {
  if (dropdown.value && !dropdown.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
