<template>
  <x-subpage-wrapper title="About">
    <!-- <x-tab></x-tab> -->
    <template #content>
      <x-result title="正在艰难翻越GFW..." v-if="loading" />
      <x-markdown v-else="!loading" :content="content"></x-markdown>
    </template>
  </x-subpage-wrapper>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import request from "@/lib/request";
const content = ref("");
const loading = ref(true);
request({
  url: "https://raw.githubusercontent.com/dangjingtao/ui-chat-view/main/docs/CHANGELOG.md",
  method: "get",
}).then((res) => {
  loading.value = false;
  console.log(typeof res);
  content.value = res;
});
// https://raw.githubusercontent.com/dangjingtao/ui-chat-view/main/docs/CHANGELOG.md
</script>
