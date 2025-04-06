<template>
  <div
    class="relative inline-block h-8.5 w-full max-w-[200px] min-w-[120px]"
    ref="dropdown"
  >
    <div
      @click="toggleDropdown"
      tabindex="0"
      class="focus:shadow-outline transition-border focus:outline-primary block w-full cursor-pointer rounded border border-gray-100 bg-white px-4 py-1 pr-8 text-sm leading-3.5 dark:border-slate-300"
      :class="{
        'cursor-not-allowed opacity-50': isLoading,
        'border-primary': isOpen,
        'hover:border-primary-4 border-gray-200': !isOpen,
      }"
      :aria-disabled="isLoading"
    >
      <span
        :class="{
          'text-gray-400': !selectedValue,
          'text-gray-700': selectedValue,
        }"
        class="inline-block max-w-full truncate overflow-hidden py-1 text-ellipsis whitespace-nowrap"
        >{{ selectedName }}</span
      >

      <div
        class="pointer-events-none absolute inset-y-0 right-0 flex max-h-[34px] items-center px-2 leading-[34px] text-gray-700"
      >
        <svg
          v-if="isLoading"
          class="h-4 w-4 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="2"
          ></circle>
        </svg>
        <svg
          v-else
          class="h-4 w-4 fill-current transition-transform duration-300"
          :class="{ 'rotate-180': isOpen }"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
    </div>

    <transition name="slide-fade">
      <div
        v-if="isOpen && !isLoading"
        class="absolute right-0 z-10 mt-1 origin-top-left overflow-auto rounded border border-gray-300/30 bg-white text-sm shadow-lg"
        :class="props.dropdownClass || 'w-full'"
      >
        <div
          v-for="option in props.options"
          :key="option.id"
          @click="selectOption(option.id)"
          class="text-overflow:ellipsis relative w-full cursor-pointer overflow-hidden px-4 py-2 hover:bg-gray-100 md:py-1.5 dark:bg-slate-100 dark:text-slate-500 dark:hover:text-slate-600"
          :title="option.name"
          :class="
            option.id === selectedValue ? 'bg-primary-1 text-primary' : ''
          "
        >
          {{ option.name }}
          <svg
            v-if="hasDeleteOption"
            @click.stop="deleteOption(option.id)"
            xmlns="http://www.w3.org/2000/svg"
            class="absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        <div v-if="!props.options || !props.options.length">
          <x-result type="404" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import {
  ref,
  watch,
  onMounted,
  onBeforeUnmount,
  computed,
  getCurrentInstance,
} from "vue";

interface Option {
  id: string;
  name: string;
}
const props = defineProps<{
  options: Option[];
  modelValue: string; // 用于 v-model
  dropdownClass?: string;
  isLoading?: boolean;
  placeHolder?: string;
  onDeleteOption?: (id: string) => void; // 新增回调
}>();

const emits = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "deleteOption", id: string): void; // 新增回调
  (e: "change", id: string): void;
}>();

const hasDeleteOption = computed(() => {
  const instance = getCurrentInstance();
  if (!instance) return false;

  // 检查父组件是否绑定了 @deleteOption
  return !!instance.vnode.props?.onDeleteOption;
});

const isOpen = ref(false);
const selectedValue = ref(props.modelValue || ""); // 使用 modelValue 初始化
const dropdown = ref<HTMLElement | null>(null);
const isLoading = computed(() => props.isLoading ?? true);

const deleteOption = (id: string) => {
  emits("deleteOption", id); // 触发回调
};

watch(
  () => props.modelValue, // 监听 modelValue 的变化
  (newValue) => {
    selectedValue.value = newValue;
    emits("change", newValue); // 触发 change
  },
);

const toggleDropdown = () => {
  if (!isLoading.value) {
    isOpen.value = !isOpen.value;
  }
};

const selectOption = (option: string) => {
  if (!isLoading.value) {
    isOpen.value = false;
    selectedValue.value = option;
    emits("update:modelValue", option); // 触发 v-model 更新
  }
};

const selectedName = computed(() => {
  return (
    props.options.find((option) => option.id === selectedValue.value)?.name ||
    props.placeHolder ||
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

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.1s ease; /* 延长动画时间 */
  will-change: transform, opacity; /* 提前优化渲染 */
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
.slide-fade-enter-to,
.slide-fade-leave-from {
  transform: translateY(0);
  opacity: 1;
}
/* 添加必要的样式 */
</style>
