<template>
  <div class="h-full w-full text-gray-700">
    <ul class="flex flex-col gap-0.5 text-sm">
      <li
        v-for="item in props.menus"
        :key="item.id"
        :class="[
          'flex cursor-pointer gap-0.5 rounded-md px-2 py-2 hover:bg-gray-100',
          { 'bg-gray-100': selectedIndex === item.id },
        ]"
        @click="selectItem(item.id)"
      >
        <span :title="item.timeStamp">{{ item.title }}</span>
        <x-button
          @click.stop="onDeleteMenuItem(item.id)"
          size="small"
          class="ml-auto bg-gray-200 hover:bg-gray-400"
          >-</x-button
        >
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, defineEmits, watch } from "vue";
const selectedIndex = ref(null);

const props = defineProps<{
  menus: any[];
  selectedItem?: string;
}>();

const emits = defineEmits(["deleteMenuItem", "changeMenuItem"]);

const onDeleteMenuItem = (id) => {
  emits("deleteMenuItem", id);
};

const selectItem = (index) => {
  selectedIndex.value = index;
  emits("changeMenuItem", index);
};

watch(
  () => props.selectedItem,
  (newVal) => {
    selectedIndex.value = newVal;
  },
);
</script>

<style scoped></style>
