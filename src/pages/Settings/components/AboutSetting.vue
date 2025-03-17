<template>
  <x-panel @click="openGithub">
    <template #title>{{ t("aboutUs") }}</template>
    <template #icon><i-mdi-github /></template>

    <x-panel-item :border="true">
      <div class="flex w-full">
        <div class="mt-3 w-24">
          <img class="ml-[-12px]" :src="logoIcon" alt="logo" srcset="" />
        </div>
        <div class="mb-6 leading-0">
          <div class="mt-4 text-lg font-bold">{{ t("uiChat") }}</div>
          <div class="mt-3 text-gray-500">{{ t("aiExperience") }}</div>
          <x-tag class="mt-5" :text="`v${version}`" />
        </div>
        <div class="ml-auto pt-10">
          <x-button type="ghost" class="h-8 leading-4" @click="checkVersion">
            <div class="flex">
              <i-mdi-autorenew />&nbsp;{{ t("checkUpdate") }}
            </div>
          </x-button>
        </div>
      </div>
    </x-panel-item>
    <x-panel-item :name="t('fixUpdateBug')" :description="t('clearLocalChat')">
      <template #formItem>
        <x-button
          class="my-auto inline-block h-7 bg-red-400 leading-3 hover:bg-red-500"
          size="small"
          @click="removeCache"
          >{{ t("deleteLocalStorage") }}</x-button
        >
      </template>
    </x-panel-item>
  </x-panel>

  <x-panel>
    <x-panel-item :border="true" :name="t('updateLog')">
      <template #icon>
        <i-mdi-bullhorn-outline />
      </template>
      <template #formItem>
        <x-button
          type="ghost"
          class="my-auto h-7 leading-3"
          @click="openChangeLog"
          >{{ t("view") }}</x-button
        >
      </template>
    </x-panel-item>

    <x-panel-item :border="true" :name="t('officialWebsite')">
      <template #icon>
        <i-mdi-web />
      </template>
      <template #formItem>
        <x-button
          type="ghost"
          class="my-auto h-7 leading-3"
          @click="openWebSite"
          >{{ t("view") }}</x-button
        >
      </template>
    </x-panel-item>

    <x-panel-item :border="true" :name="t('license')">
      <template #icon>
        <i-mdi-license />
      </template>
      <template #formItem>
        <x-button
          type="ghost"
          class="my-auto h-7 leading-3"
          @click="openLicense"
          >{{ t("view") }}</x-button
        >
      </template>
    </x-panel-item>

    <x-panel-item :name="t('feedback')">
      <template #icon>
        <i-mdi-email-arrow-right-outline />
      </template>
      <template #formItem>
        <x-button
          type="ghost"
          class="my-auto h-7 leading-3"
          @click="sendMail"
          >{{ t("email") }}</x-button
        >
      </template>
    </x-panel-item>
  </x-panel>
  <x-popup ref="popup">
    <x-markdown-page type="github" :file-path="`/${filePath}`" />
  </x-popup>
</template>
<script lang="ts" setup>
declare const __APP_VERSION__: string;
const version = __APP_VERSION__;

import message from "@/lib/message";
import cachePlugin from "@/plugins/cachePlugin";
import { ref } from "vue";
import { checkUpdate } from "@/lib/pwa";
import logoIcon from "@/assets/images/logoIcon.png";
import dialog from "@/lib/dialog";
import { requestAppVersion } from "@/lib/requestGithub";
import { useNamespace } from "@/i18n";

const { t } = useNamespace("Settings.AboutSetting");

const popup = ref<any>(null);
const filePath = ref("");

const openLicense = () => {
  filePath.value = "LICENSE";
  if (popup.value) {
    popup.value.open();
  }
};

const checkVersion = async () => {
  // @ts-ignore
  const version = await requestAppVersion();

  dialog.confirm({
    type: "info",
    title: `${t("latestVersion")} ${version}`,
  });
};

const openChangeLog = () => {
  filePath.value = "docs/CHANGELOG.md";
  if (popup.value) {
    popup.value.open();
  }
};

const openWebSite = () => {
  window.open("https://docs.uichat.tomz.io");
};

const openGithub = () => {
  window.open("https://github.com/dangjingtao/ui-chat-view");
};

const sendMail = () => {
  window.open("mailto: dangjingtap@gmail.com");
};

const removeCache = async () => {
  const result = await dialog.confirm({
    type: "alert",
    message: t("deleteLocalStorageMessage"),
  });

  if (result) {
    cachePlugin
      .clearAllCache()
      .then(cachePlugin.install.bind(cachePlugin))
      .then(() => {
        message.success(t("clearSuccess"));
        setTimeout(() => {
          localStorage.clear();
          checkUpdate();
          // @ts-ignore
          location.href = "/login";
        }, 2500);
      });
  }
};
</script>
