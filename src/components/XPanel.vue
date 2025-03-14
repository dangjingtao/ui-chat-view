<template>
  <div
    class="mt-4 rounded-md border border-gray-200 bg-gray-50 px-4 py-1 text-sm text-gray-600"
  >
    <h2
      v-if="$slots.title"
      class="flex justify-between border-b border-gray-200 pt-2 pb-1 text-lg leading-8 font-bold md:text-lg"
    >
      <slot name="title"></slot>
      <div @click="onClick" class="my-auto cursor-pointer" v-if="$slots.icon">
        <slot name="icon"></slot>
      </div>
    </h2>
    <div>
      <slot></slot>
    </div>

    <p v-if="props.description" class="my-4 text-gray-500">
      {{ props.description }}
    </p>
  </div>
</template>
<script lang="ts" setup>
const emits = defineEmits(["click"]);
const onClick = (event) => {
  emits("click", event);
};
const props = defineProps<{
  title?: string;
  description?: string;
}>();
</script>
