<template>
  <div
    :class="{
      'xl:mx-[15%]': !isFullWidth,
    }"
    class="relative m-auto flex h-full min-h-[400px] flex-col bg-white px-0"
  >
    <x-button type="text" class="absolute top-0 right-0" @click="onClose">
      <i-mdi-close class="text-bold text-xl text-gray-800" />
    </x-button>
    <div class="flex h-11 w-full">
      <h2
        class="m-0 w-full p-0 text-center text-lg leading-11 font-bold text-gray-600"
      >
        {{ title }}
      </h2>
    </div>
    <div class="flex-1 overflow-auto px-3 md:px-6">
      <slot name="content"></slot>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from "vue";
import { useRouter } from "vue-router";

const props = defineProps<{
  title?: string;
  isFullWidth?: boolean;
}>();

const emits = defineEmits(["onClose"]);

const title = computed(() => {
  return props.title;
});

const router = useRouter();

const onClose = () => {
  if (props.isFullWidth) {
    emits("onClose", router);
  } else {
    router.go(-1);
  }
};
</script>
<style scoped></style>
