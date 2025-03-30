<template>
  <div
    :class="{
      'm-auto max-w-[1440px]': !isFullWidth,
    }"
    class="relative m-auto flex h-full min-h-[400px] flex-col bg-white px-0"
  >
    <x-dropdown
      v-if="!isFullWidth"
      :menu-items="[
        { name: t('uichat'), path: '/' },
        { name: t('character'), path: '/characters' },
        { name: t('knowledgeHub'), path: '/knowledge-hub' },
        { name: t('plugins'), path: '/Plugins' },
        { name: t('settings'), path: '/settings' },
      ]"
      class="absolute top-0 left-0"
    />

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
    <div
      :class="{
        'md:px-4': isFullWidth,
        'md:px-6': !isFullWidth,
      }"
      class="flex-1 overflow-auto px-3"
    >
      <slot name="content"></slot>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { loadModuleTranslations, useNamespace } from "@/i18n";

loadModuleTranslations("components");

const { t } = useNamespace("Components.XSubpageWrapper");

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
