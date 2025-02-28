<template>
  <div
    :class="{
      'md:w-[80%]': !isFullWidth,
    }"
    class="relative m-auto flex h-full min-h-[400px] w-full flex-col bg-white px-3 sm:mt-1 sm:px-5"
  >
    <x-button type="text" class="absolute top-1 right-0" @click="onClose">
      <i-mdi-close class="text-bold text-xl text-gray-800" />
    </x-button>
    <div class="flex h-14 w-full">
      <h2
        class="m-0 w-full p-0 text-center text-lg leading-14 font-bold text-gray-600"
      >
        {{ title }}
      </h2>
    </div>
    <div class="flex-1 overflow-auto">
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
  console.log(router);

  emits("onClose", router);
  router.go(-1);
};
</script>
<style scoped></style>
