<template>
  <div>
    <x-spin v-if="loading" class="pt-50" />
    <x-markdown
      class="p-5 px-6"
      v-else="!loading"
      :content="content"
    ></x-markdown>
    <x-result
      :title="error.message"
      type="500"
      v-if="error"
      class="lg:w-[60%]"
    />
    <!-- <x-result title="Network error" type="500" v-if="true" /> -->
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import request from "@/lib/request";
import { AxiosError } from "axios";
import { requestGithubFileContent } from "@/lib/requestGithub";
const content = ref("");
const loading = ref(true);
const error = ref<AxiosError | null>(null);

const props = defineProps<{
  type?: "github";
  markdownUrl?: string;
  filePath?: string;
}>();

if (props.type === "github") {
  requestGithubFileContent({ filePath: props.filePath }).then((res) => {
    loading.value = false;
    content.value = res;
  });
} else {
  if (props.markdownUrl) {
    request({
      url: props.markdownUrl,
      method: "get",
    })
      .then((res) => {
        loading.value = false;
        content.value = res.data;
      })
      .catch((err: AxiosError) => {
        console.log(err);
        loading.value = false;
        error.value = err;
      });
  }
}
</script>
