<template>
  <div class="overflow-hidden rounded-t-md">
    <!-- Tab Bar -->
    <div
      class="tab-container flex items-center overflow-hidden overflow-x-auto bg-gray-100 px-1 pt-1 pb-0"
    >
      <div class="flex items-center space-x-1">
        <div class="mr-1.5 px-2"><i-mdi-console class="leading-9" /></div>
        <div
          v-for="(tab, index) in tabs"
          :key="index"
          @click="selectTab(index)"
          :class="[
            'flex cursor-pointer items-center px-4 text-sm font-medium transition-colors select-none',
            activeTab === index
              ? 'rounded-t-md bg-[rgb(249,248,246)] py-2 text-gray-900 shadow-sm dark:bg-[rgb(29,30,32)]'
              : 'rounded-md bg-gray-50 py-1.5 text-gray-600 hover:bg-gray-200',
          ]"
        >
          <span class="mr-2 max-w-[150px] truncate">{{ tab.title }}</span>
          <div
            v-if="tabs.length > 1 && props.editable"
            @click.stop="closeTab(index)"
            class="flex h-4 w-4 items-center justify-center rounded-full hover:bg-gray-300"
          >
            <i-mdi-close class="h-3 w-3 text-gray-500 hover:text-gray-800" />
          </div>
        </div>
      </div>

      <!-- Add Tab Button -->
      <div
        v-if="props.editable"
        @click="addTab"
        class="ml-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-gray-600 hover:bg-gray-200 hover:text-gray-800"
      >
        <i-mdi-file-plus class="h-4 w-4" />
      </div>
    </div>

    <!-- Tab Content -->
    <div
      class="h-[calc(100%-43px)] min-h-[200px] overflow-auto rounded-b bg-[rgb(249,248,246)] dark:bg-[rgb(29,30,32)]"
    >
      <div v-if="tabs.length > 0">
        <slot
          name="tabContent"
          :activeTab="activeTab"
          :currentTab="tabs[activeTab]"
          :tabs="tabs"
        >
          <!-- 默认内容，作为fallback -->
          <h3 class="mb-2 text-lg font-semibold text-gray-900">
            {{ tabs[activeTab].title }}
          </h3>
          <p class="text-gray-700">{{ tabs[activeTab].content }}</p>
        </slot>
      </div>
      <div v-else class="py-12 text-center text-gray-500">
        No tabs open. Click the "+" button to add a tab.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  initialTabs: {
    type: Array,
    default: () => [],
  },
});

const tabs = ref([]);
const activeTab = ref(0);

// 初始化tabs
tabs.value = [...props.initialTabs];

const selectTab = (index) => {
  activeTab.value = index;
};

const closeTab = (index) => {
  tabs.value.splice(index, 1);
  if (activeTab.value >= tabs.value.length) {
    activeTab.value = Math.max(0, tabs.value.length - 1);
  }
};

const addTab = () => {
  const tabCount = tabs.value.length + 1;
  tabs.value.push({
    title: `newfile${tabCount}.txt`,
    content: `This is a newly created file #${tabCount}.`,
  });
  activeTab.value = tabs.value.length - 1;
};
</script>

<style scoped>
.tab-container {
  scrollbar-width: none;
}
.tab-container::-webkit-scrollbar {
  display: none;
}
</style>
