<template>
  <!-- <div
    class="border-primary-10 h-[600px] w-[350px] overflow-hidden rounded-2xl border"
  >
    <mobile-chat></mobile-chat>
  </div> -->
  <div class="border-primary-10 h-full w-full overflow-hidden border">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import MobileChat from "@/blocks/MobileChat.vue";
</script>

<style scoped></style>
