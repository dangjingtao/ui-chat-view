<template>
  <div class="flex flex-col gap-1.5">
    <div
      :class="{
        'border-b': props.border,
      }"
      class="flex min-h-12 justify-between border-gray-200 leading-12"
    >
      <slot></slot>
      <div v-if="props.name" class="leading-10] flex min-w-[100px] gap-2">
        <div v-if="$slots.icon" class="my-auto"><slot name="icon"></slot></div>
        {{ props.name }}
        <div v-if="props.description" class="my-auto">
          <x-tooltip :text="props.description" position="top"
            ><i-mdi-information-slab-circle-outline class="block"
          /></x-tooltip>
        </div>
      </div>

      <slot name="formItem"></slot>
    </div>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps<{
  name?: string;
  description?: string;
  border?: boolean;
}>();
</script>
