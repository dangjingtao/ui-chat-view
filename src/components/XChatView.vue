<template>
  <div class="mx-auto flex h-full flex-col p-2 text-sm">
    <div class="flex-1" ref="chatHistory">
      <div v-for="(message, index) in messages" :key="index" class="mb-4">
        <div
          :class="{
            'text-right': message.role === 'user',
            'text-left': message.role === 'assistant',
          }"
        >
          <div
            :class="{
              'bg-green-200': message.role === 'user',
              'bg-white': message.role === 'assistant',
            }"
            class="inline-block max-w-[80%] rounded-lg p-2"
          >
            {{ message.content }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    messages: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped></style>
