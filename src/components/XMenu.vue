<template>
  <div class="h-full w-full text-gray-700">
    <ul class="flex flex-col gap-3 text-sm">
      <li v-for="(group, date) in groupedMenus" :key="date">
        <div class="bg-primary-1 mb-2 rounded p-2 font-bold text-gray-500">
          {{ date }}
        </div>
        <ul class="flex flex-col gap-2">
          <li
            v-for="item in group"
            :key="item.id"
            :class="[
              'flex cursor-pointer gap-2 rounded-md px-2 py-1.5 leading-6 hover:bg-gray-100',
              {
                'bg-gray-100': selectedIndex === item.id,
              },
            ]"
            @click="selectItem(item.id)"
          >
            <span
              class="flex-1 overflow-hidden text-ellipsis whitespace-nowrap"
              :title="item.title"
              >{{ item.title }}</span
            >
            <div
              @click.stop="onDeleteMenuItem(item.id)"
              :class="[
                'ml-auto flex w-6 cursor-pointer rounded-full hover:bg-gray-200',
              ]"
            >
              <i-mdi-close class="m-auto block text-xs leading-6" />
            </div>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, defineEmits, watch, computed } from "vue";

interface MenuItem {
  id: string;
  title: string;
  createTime: string;
}

const props = defineProps<{
  menus: MenuItem[];
  selectedItem?: string;
}>();

const selectedIndex = ref<string | null>(props.selectedItem ?? null);

const emits = defineEmits(["deleteMenuItem", "changeMenuItem"]);

const onDeleteMenuItem = (id) => {
  emits("deleteMenuItem", id);
};

const selectItem = (index) => {
  selectedIndex.value = index;
  emits("changeMenuItem", index);
};

const groupedMenus = computed(() => {
  return props.menus.reduce((groups, item) => {
    const date = new Date(item.createTime).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {});
});

watch(
  () => props.selectedItem,
  (newVal) => {
    selectedIndex.value = newVal ?? null;
  },
);
</script>

<style scoped></style>
