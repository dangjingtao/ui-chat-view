<template>
  <div class="safe-area">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'SafeArea',
};
</script>

<style scoped>
.safe-area {
  padding-top: env(safe-area-inset-top);
  padding-right: env(safe-area-inset-right);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  box-sizing: border-box;
}
</style>