<template>
  <div
    class="w-full overflow-hidden rounded-md border border-gray-300 bg-white"
  >
    <div
      ref="header"
      :class="{
        'h-0 overflow-hidden': !props.title,
        'border-b border-gray-200 px-4 py-2 dark:border-gray-300':
          !!props.title,
      }"
    >
      <h2 class="text-md leading-tight text-gray-800">
        {{ props.title }}
      </h2>
    </div>
    <ul :style="{ maxHeight: ulMaxHeight + 'px' }" class="overflow-y-auto">
      <x-result v-if="props.items.length === 0" class="w-[50%]" type="404" />
      <li
        v-for="(item, index) in props.items"
        :key="item.id"
        @click="selectItem(item)"
        :class="{
          'bg-primary-1': selectedItem && selectedItem.id === item.id,
          'border-0 hover:bg-gray-50': true,
          'border-t': index !== 0,
        }"
        class="cursor-pointer border-gray-200 px-4 py-2 text-sm leading-tight text-gray-700 dark:border-gray-300"
      >
        <slot
          name="item"
          :item="item"
          :selected="selectedItem && selectedItem.id === item.id"
        >
          <!-- 默认内容 -->
          {{ item.name }}
        </slot>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

interface ListItem {
  id: number | string;
  name: string;
}

const props = defineProps<{
  items: ListItem[];
  title?: string;
}>();

const emit = defineEmits<{
  (e: "select", item: ListItem): void;
}>();

const selectedItem = ref<ListItem | null>(null);
const ulMaxHeight = ref(0);
const header = ref<HTMLElement | null>(null);

function selectItem(item: ListItem) {
  selectedItem.value = item;
  emit("select", item);
}

onMounted(() => {
  if (header.value) {
    const headerHeight = header.value.offsetHeight;
    const containerHeight = header.value.parentElement?.offsetHeight || 0;
    ulMaxHeight.value = containerHeight - headerHeight;
  }
});
</script>

<style scoped>
/* 你可以在这里添加自定义样式 */
</style>
