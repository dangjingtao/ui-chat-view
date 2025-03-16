<template>
  <x-subpage-wrapper :title="t('settings')">
    <template #content>
      <div class="flex-1 overflow-auto pb-6">
        <general-setting />
        <conversation-and-task-setting />
        <!-- <model-setting /> -->
        <about-setting />
      </div>
    </template>
  </x-subpage-wrapper>
</template>
<script lang="ts" setup>
// import SystemSetting from "./components/SystemSetting.vue";
import AboutSetting from "./components//AboutSetting.vue";
import GeneralSetting from "./components/GeneralSetting.vue";
import ConversationAndTaskSetting from "./components/ConversationAndTaskSetting/index.vue";
import { loadModuleTranslations, useNamespace } from "@/i18n";
loadModuleTranslations("pages/Settings");
const { t } = useNamespace("Settings.Index");
</script>
<style scoped></style>
