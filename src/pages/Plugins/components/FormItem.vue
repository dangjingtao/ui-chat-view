<template>
  <div>
    <h3 v-if="label" class="mt-1.5 flex gap-1 text-sm leading-8 text-gray-700">
      <div>{{ label }}</div>
      <x-tooltip
        v-if="tooltip"
        position="right"
        class="flex items-center"
        :text="tooltip"
      >
        <i-mdi-help-circle-outline />
      </x-tooltip>
    </h3>
    <div class="flex w-full gap-2">
      <slot />
    </div>
    <div class="mt-2">
      <slot name="extra"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label?: string; // 表单项标题
  tooltip?: string; // 可选的提示信息
}>();
</script>
