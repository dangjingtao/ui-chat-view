<template>
  <x-panel>
    <template #title>{{ t("general") }}</template>

    <x-panel-item
      :name="t('language')"
      :border="true"
      :description="t('languageDescription')"
    >
      <template #formItem>
        <x-select
          class="mt-2"
          @change="setLocale"
          :options="[
            { id: 'zh', name: t('simplifiedChinese') },
            { id: 'en', name: t('english') },
          ]"
          :selectedValue="currentLanguage"
        />
      </template>
    </x-panel-item>

    <x-panel-item :border="true" :name="t('theme')">
      <template #formItem>
        <x-select
          :selected-value="currentTheme"
          @change="toggleTheme"
          class="mt-2"
          :options="[
            { id: 'geekblue', name: t('geekblue') },
            { id: 'volcano', name: t('volcano') },
            { id: 'gaypurple', name: t('gaypurple') },
            { id: 'hatgreen', name: t('hatgreen') },
            { id: 'magenta', name: t('magenta') },
          ]"
        />
      </template>
    </x-panel-item>

    <x-panel-item :name="t('darkMode')">
      <template #formItem>
        <x-switch class="mt-2" @toggle="toggleMode" :model-value="isDarkMode" />
      </template>
    </x-panel-item>
  </x-panel>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { useNamespace, useLocale } from "@/i18n";

const { t } = useNamespace("Settings.GeneralSetting");

// 主题
const theme = localStorage.getItem("theme") || "geekblue";
const currentTheme = ref(theme);

function toggleTheme(id) {
  document.documentElement.classList.remove(`theme-${currentTheme.value}`);
  document.documentElement.classList.add(`theme-${id}`);
  currentTheme.value = id;
  localStorage.setItem("theme", id);
}

// 语言
const { setLocale, getLocale } = useLocale();
const language = getLocale();
const currentLanguage = ref(language);

// 暗色
const colorMode = localStorage.getItem("colorMode");
const isDarkMode = ref(colorMode === "dark");
function toggleMode(mode) {
  localStorage.setItem("colorMode", mode ? "dark" : "");
  if (mode) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}
</script>
