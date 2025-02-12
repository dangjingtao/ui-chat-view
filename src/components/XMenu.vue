<template>
  <div class="h-full w-full text-gray-700">
    <ul class="flex flex-col gap-0.5 text-sm">
      <li
        v-for="(item, index) in menuItems"
        :key="index"
        :class="[
          'cursor-pointer rounded-md px-2 py-2 hover:bg-gray-100',
          { 'bg-gray-100': selectedIndex === index },
        ]"
        @click="selectItem(index)"
      >
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from "vue";

const menuItems = ref(["Home", "About", "Services", "Contact"]);
const selectedIndex = ref(null);

const selectItem = (index) => {
  selectedIndex.value = index;
};
</script>

<style scoped></style>
