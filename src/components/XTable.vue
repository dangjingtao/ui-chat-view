<template>
  <table
    class="flex h-full min-w-full table-fixed flex-col divide-y divide-gray-200 overflow-auto"
  >
    <thead class="bg-gray-50">
      <tr class="flex">
        <th
          width="60"
          v-if="selectable"
          class="fixed-column py-4 pr-1 pl-6 text-left text-sm font-medium tracking-wider text-gray-600 uppercase"
        >
          <x-checkbox
            :indeterminate="isIndeterminate"
            @change="toggleSelectAll"
            :checked="isAllSelected"
          />
        </th>
        <th
          v-for="column in columns"
          :key="column.key"
          :width="column.width || 'auto'"
          :class="{
            'flex-1': !column.width,
            'fixed-column': column.fixed,
          }"
          class="px-2 py-4 text-left text-sm font-bold tracking-wider text-gray-800 uppercase"
        >
          {{ column.title }}
        </th>
      </tr>
    </thead>
    <tbody
      class="w-full flex-1 divide-y divide-gray-200 overflow-auto bg-white"
    >
      <x-empty v-if="props.data.length === 0" />
      <tr
        v-for="(row, rowIndex) in data"
        :key="row.id"
        class="flex w-full"
        :class="{
          'even:bg-gray-50': rowIndex % 2 === 1,
          'hover:bg-gray-100': true,
        }"
      >
        <td
          width="60"
          v-if="selectable"
          class="fixed-column py-3 pr-1 pl-6 whitespace-nowrap"
        >
          <x-checkbox
            @change="toggleSelect(row.id)"
            :checked="selectedRows.includes(row.id)"
          />
        </td>
        <td
          v-for="column in columns"
          :key="column.key"
          :width="column.width"
          :class="{
            'flex-1': !column.width,
            'fixed-column': column.fixed,
          }"
          class="truncate px-2 py-3 text-sm font-medium tracking-wider whitespace-nowrap text-gray-600"
        >
          <component
            :is="column.render ? column.render : 'span'"
            :row="row"
            :column="column"
            :render="column.render"
          >
            {{ row[column.key] }}
          </component>
          <!-- {{ row[column.key] }} -->
        </td>
      </tr>
    </tbody>
  </table>

  <div
    v-if="selectedRows.length > 0"
    class="bg-primary-1 border-primary-3 fixed bottom-20 left-1/2 flex h-10 -translate-x-1/2 transform rounded-xl border px-3 py-1 text-white shadow-2xl"
  >
    <div
      class="text-primary flex gap-2 px-2 text-sm leading-8 font-bold"
      href="javascript:;"
    >
      已选择
      <div
        class="bg-primary text-primary-1 mt-1 h-6 min-w-6 rounded text-center leading-6"
      >
        {{ selectedRows.length }}
      </div>
    </div>

    <a
      class="hover:bg-primary-2 flex gap-2 rounded px-2 text-sm leading-8 text-gray-700"
      href="javascript:;"
      @click="() => onBatchUpgrade('enable')"
      ><i-mdi-check-circle-outline class="my-auto" /> 启用
    </a>

    <a
      class="hover:bg-primary-2 flex gap-2 rounded px-2 text-sm leading-8 text-gray-700"
      href="javascript:;"
      @click="() => onBatchUpgrade('disable')"
      ><i-mdi-close-circle-outline class="my-auto" /> 禁用
    </a>
    <!-- <a
      class="hover:bg-primary-2 flex gap-2 rounded px-2 text-sm leading-8 text-gray-700"
      href="javascript:;"
      ><i-mdi-archive-settings-outline class="my-auto" /> 归档
    </a> -->

    <a
      class="hover:bg-primary-2 flex gap-2 rounded px-2 text-sm leading-8 text-red-500"
      href="javascript:;"
      @click="() => onBatchUpgrade('delete')"
      ><i-mdi-delete-outline class="my-auto" /> 删除
    </a>

    <a
      @click="disSelectAll"
      class="flex gap-2 px-2 text-sm leading-8 font-bold text-gray-700"
      href="javascript:;"
    >
      取消
    </a>
  </div>
</template>

<script setup>
import _ from "lodash";
import { ref, computed, toRaw } from "vue";
import XCheckbox from "./XCheckbox.vue";
import message from "@/lib/message";

const props = defineProps({
  columns: {
    type: Array,
    required: true,
  },
  data: {
    type: Array,
    required: true,
  },
  selectable: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(["batchUpgrade"]);

const onBatchUpgrade = async (order) => {
  await emits(
    "batchUpgrade",
    _.cloneDeep(toRaw(selectedRows.value.map((item) => item))),
    order,
  );
  disSelectAll();
  message.success("操作成功");
};

const selectedRows = ref([]);

const isAllSelected = computed(() => {
  return (
    selectedRows.value.length === props.data.length &&
    props.data.length !== 0 &&
    !!props.data
  );
});

const isIndeterminate = computed(() => {
  return selectedRows.value.length > 0 && !isAllSelected.value;
});

const disSelectAll = () => {
  selectedRows.value = [];
};
const selectAll = () => {
  selectedRows.value = props.data.map((item) => item.id);
};
const toggleSelectAll = () => {
  if (isAllSelected.value) {
    disSelectAll();
  } else {
    selectAll();
  }
};

const toggleSelect = (id) => {
  if (selectedRows.value.includes(id)) {
    selectedRows.value = selectedRows.value.filter((item) => item !== id);
  } else {
    selectedRows.value.push(id);
  }
};
</script>

<style scoped>
.fixed-column {
  position: sticky;
  left: 0;
  z-index: 1;
  border-right: 1px solid #e5e7eb; /* Tailwind CSS gray-200 */
}
</style>
