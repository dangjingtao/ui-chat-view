<template>
  <div class="mx-auto flex h-full w-[90%] max-w-[800px] flex-col p-2 text-sm">
    <div class="flex-1" ref="chatHistory">
      <div
        v-for="(message, index) in messages"
        :key="index"
        class="chat-item mb-4"
      >
        <div
          :class="{
            'flex justify-end': message.role === 'user',
            'flex justify-start gap-2': message.role !== 'user',
          }"
        >
          <div v-if="message.role !== 'user'" class="w-10">
            <img src="@/assets/fmt.webp" alt="" srcset="" />
          </div>
          <div
            :class="{
              'bg-primary-2': message.role === 'user',
              'bg-white': message.role !== 'user',
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
<style scoped>
.chat-item:first-child {
  margin-top: 1.5rem;
}
</style>
