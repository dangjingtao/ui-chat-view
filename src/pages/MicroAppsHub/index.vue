<template>
  <x-subpage-wrapper
    :title="t('title')"
    :isFullWidth="props.isFullWidth"
    @onClose="props.onClose"
  >
    <template #content>123 </template>
  </x-subpage-wrapper>
</template>

<script lang="ts" setup>
import { loadModuleTranslations, useNamespace } from "@/i18n";
loadModuleTranslations("pages/MicroAppsHub");
const { t } = useNamespace("ChatCharacters");

const props = defineProps<{
  isFullWidth?: boolean;
  onClose?: () => void;
}>();
</script>

<style scoped></style>
