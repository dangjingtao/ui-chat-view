<template>
  <div class="h-full w-full text-gray-700">
    <ul class="flex flex-col gap-2 text-sm">
      <li
        v-for="item in props.menus"
        :key="item.id"
        :class="[
          'flex cursor-pointer gap-0.5 rounded-md px-2 py-1.5 leading-6 hover:bg-gray-100',
          {
            'bg-gray-100': selectedIndex === item.id,
          },
        ]"
        @click="selectItem(item.id)"
      >
        <span
          class="overflow-hidden text-ellipsis whitespace-nowrap"
          :title="item.title"
          >{{ item.title }}</span
        >
        <x-button
          @click.stop="onDeleteMenuItem(item.id)"
          size="small"
          class="ml-auto cursor-pointer bg-gray-200 hover:bg-gray-400"
          >x</x-button
        >
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, defineEmits, watch } from "vue";

const props = defineProps<{
  menus: any[];
  selectedItem?: string;
}>();

const selectedIndex = ref(props.selectedItem || null);

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
    console.log(777, newVal);
    selectedIndex.value = newVal;
  },
);

watch(
  () => props.menus,
  (newVal) => {
    console.log(888, newVal);
  },
);
</script>

<style scoped></style>
