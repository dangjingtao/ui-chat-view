<template>
  <div>
    <div class="relative inline-block text-left">
      <x-button
        type="text"
        @click="toggleDropdown"
        class="rounded-sm px-4 py-2 text-sm font-medium"
      >
        <i-mdi-menu-open class="text-bold text-xl text-gray-800" />
      </x-button>

      <transition name="slide-fade">
        <div
          v-if="isOpen"
          class="left absolute z-20 mt-1 w-56 origin-top-left rounded-sm border border-gray-200 bg-white"
        >
          <div
            class="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <a
              v-for="item in menuItems"
              :key="item.name"
              :href="item.path"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
              @click.prevent="navigateTo(item.path)"
            >
              {{ item.name }}
            </a>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const props = defineProps<{
  menuItems: { name: string; path: string }[];
}>();

const isOpen = ref(false);
const router = useRouter();

function toggleDropdown() {
  isOpen.value = !isOpen.value;
}

function navigateTo(path: string) {
  isOpen.value = false;
  router.push(path);
}
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.1s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
