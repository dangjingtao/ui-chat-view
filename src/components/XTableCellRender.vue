<template>
  {{ renderContent }}
  <!-- <component :is="renderComponent">renderContent</component> -->
</template>
<script lang="ts" setup>
import { ref, shallowRef, computed } from "vue";
const props = defineProps({
  row: Object,
  column: Object,
  render: Object,
});
const renderContent = computed(() =>
  props.render.renderer({
    row: props.row,
    column: props.column,
    content: props.row[props.column.key],
  }),
);
// const renderComponent = shallowRef(props.render.renderer({ props }));
</script>
