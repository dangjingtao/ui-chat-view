<template>
  <span
    class="bg-primary-1 text-primary border-primary-4 inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium"
  >
    {{ text }}
    <button
      v-if="removable"
      @click="removeTag"
      class="bg-primary-2 hover:bg-primary-3 ml-2 inline-flex items-center justify-center rounded-full p-1 focus:outline-none"
    >
      <svg
        class="h-3 w-3"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        ></path>
      </svg>
    </button>
  </span>
</template>

<script setup lang="ts">
const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  removable: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["remove"]);

const removeTag = () => {
  emit("remove");
};
</script>

<style scoped>
/* 你可以在这里添加额外的样式 */
</style>
