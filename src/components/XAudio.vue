<template>
  <div
    class="mx-auto w-full rounded-lg border border-gray-50 bg-white p-4 shadow-sm"
  >
    <audio
      ref="audio"
      :src="props.src"
      @timeupdate="updateProgress"
      @ended="onAudioEnd"
    ></audio>
    <div class="flex items-center justify-between">
      <x-button
        @click="togglePlay"
        class="bg-primary hover:bg-primary rounded-full p-2 text-white"
      >
        <i-mdi-play v-if="!isPlaying" />
        <i-mdi-pause v-else />
      </x-button>
      <div class="mx-4 flex-1">
        <x-slider
          :hideValue="true"
          :min="0"
          :step="0.1"
          v-model="currentTime"
          @input="seekAudio"
          class="w-full"
          :max="duration"
        />

        <div class="flex justify-between text-xs text-gray-500">
          <span>{{ formatTime(currentTime) }}</span>
          <span>{{ formatTime(duration) }}</span>
        </div>
      </div>
      <div class="relative">
        <x-button
          @click="downloadAudio"
          class="bg-primary hover:bg-primary rounded-full p-2 text-white"
        >
          <i-mdi-download />
        </x-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const audio = ref<HTMLAudioElement | null>(null);
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const volume = ref(1);
const showVolumeControl = ref(false);

const props = defineProps<{
  src: string;
}>();

const togglePlay = () => {
  if (!audio.value) return;
  if (isPlaying.value) {
    audio.value.pause();
    isPlaying.value = !isPlaying.value;
  } else if (props.src) {
    audio.value.play();
    isPlaying.value = !isPlaying.value;
  }
};

const updateProgress = () => {
  if (!audio.value) return;
  currentTime.value = audio.value.currentTime;
  duration.value = audio.value.duration;
};

const seekAudio = () => {
  if (!audio.value) return;
  audio.value.currentTime = currentTime.value;
};

const onAudioEnd = () => {
  isPlaying.value = false;
};

const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
};

const downloadAudio = () => {
  if (!props.src) return;

  // 创建一个隐藏的 <a> 元素
  const link = document.createElement("a");
  link.href = props.src;
  link.download = "audio-file.wav"; // 设置下载文件名
  document.body.appendChild(link);

  // 触发点击事件下载文件
  link.click();

  // 移除 <a> 元素
  document.body.removeChild(link);
};

onMounted(() => {
  if (audio.value) {
    audio.value.volume = volume.value;
  }
});
</script>

<style scoped>
/* 可根据需要添加自定义样式 */
</style>
