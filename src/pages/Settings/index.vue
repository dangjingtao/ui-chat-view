<template>
  <x-subpage-wrapper :title="$t('Settings')">
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
import { loadModuleTranslations } from "@/i18n";
loadModuleTranslations("pages/Settings");
</script>
<style scoped></style>
