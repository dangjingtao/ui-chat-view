<template>
  <x-subpage-wrapper title="Result">
    <template #content>
      <x-result :title="ctx.title || '出错了'" :description="ctx.description" />
    </template>
  </x-subpage-wrapper>
</template>
<script lang="ts" setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
const ctx = computed(() => {
  return { title: route.params.title, description: route.params.description };
});
console.log(111, route);
</script>
