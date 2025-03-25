<template>
  <x-subpage-wrapper :title="pageTitle">
    <template #content>
      <component :is="currentComponent" />
    </template>
  </x-subpage-wrapper>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import useDynamicComponent from "@/hooks/useDynamicComponent";
import { ref, watch, computed } from "vue";
import { plugins } from "../data/plugins";
import XResult from "@/components/XResult.vue";
import message from "@/lib/message";
import { loadModuleTranslations } from "@/i18n";

loadModuleTranslations("pages/Plugins");

const router = useRouter();
const route = useRoute();

const pageTitle = computed(() => {
  return (
    plugins.find((plugin) => plugin.id == route.params.id)?.name ||
    "Unknown Page"
  );
});

const { currentComponent, loadComponent } = useDynamicComponent({
  onError: ({ name }) => {
    currentComponent.value = XResult;
    message.error(`Error loading component ${name}`);
  },
});

const loadPage = (id) => {
  const currentPlugin = plugins.find((plugin) => plugin.id == id);
  if (currentPlugin) {
    loadComponent(
      `pages/Plugins/components/pluginViews/${currentPlugin.component}`,
    );
  }
};

watch(
  () => route.params.id,
  (newId) => {
    loadPage(newId);
  },
  { immediate: true },
);
</script>
