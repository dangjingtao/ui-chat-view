<template>
  <div class="relative inline-block w-full min-w-[120px]">
    <div
      @click="toggleDropdown"
      class="focus:shadow-outline block w-full cursor-pointer rounded bg-white px-4 py-2 pr-8 leading-tight focus:outline-none"
    >
      {{ selectedOption || "select model" }}
      <div
        class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
      >
        <svg
          class="h-4 w-4 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          />
        </svg>
      </div>
    </div>
    <div
      v-if="isOpen"
      class="absolute z-10 mt-1 w-full rounded bg-white shadow-lg"
      style="min-width: 200px"
    >
      <div
        v-for="option in options"
        :key="option"
        @click="selectOption(option)"
        class="cursor-pointer px-4 py-1 hover:bg-gray-200"
      >
        {{ option }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "XSelect",
  data() {
    return {
      isOpen: false,
      selectedOption: "",
      options: ["kimi", "qwen", "deepseek"],
    };
  },
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen;
    },
    selectOption(option) {
      this.selectedOption = option;
      this.isOpen = false;
    },
  },
};
</script>

<style scoped></style>
