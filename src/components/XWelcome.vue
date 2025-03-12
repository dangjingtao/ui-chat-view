<template>
  <transition
    name="slide"
    type="transition"
    duration="300"
    :appear="true"
    enter-from-class="opacity-0 transform translate-y-[-20px]"
    enter-to-class="opacity-100 transform translate-y-0"
    appear-active-class="transition ease-out duration-300"
    enter-active-class="transition ease-out duration-300"
    leave-active-class="transition ease-in duration-300"
    leave-from-class="opacity-100 transform translate-y-0"
    leave-to-class="opacity-0 transform translate-y-[-20px]"
  >
    <div
      class="m-auto mt-[20vh] flex w-[90%] max-w-[800px] min-w-[300px] flex-col gap-2 rounded-md bg-white p-8 shadow-sm sm:flex-row sm:items-center sm:gap-6 sm:py-4"
    >
      <img
        class="mx-auto block h-16 rounded-full sm:mx-0 sm:shrink-0"
        :src="host"
        alt=""
      />
      <div class="space-y-2 text-center sm:text-left">
        <div class="space-y-0.5">
          <p class="text-md font-semibold text-black">
            Hello, I'm Erin Lindford
          </p>
          <p class="text-sm font-medium text-gray-500">What can I do for U?</p>
        </div>
      </div>
    </div>
  </transition>
</template>
<script setup lang="ts">
import host from "@/assets/images/host.webp";
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
