<template>
  <div class="bg-primary-5 flex min-h-screen items-center justify-center">
    <div class="flex w-full max-w-4xl items-center">
      <!-- <div
        class="hidden w-2/3 bg-cover bg-center lg:block"
        style="background-image: url(&quot;your-image-url.jpg&quot;)"
      ></div> -->
      <div class="m-auto w-full max-w-sm rounded-lg bg-white p-8 shadow-lg">
        <!-- <h2 class="mb-6 text-center text-2xl font-bold"></h2> -->
        <div class="mb-7 flex w-full items-center">
          <x-brand class="m-auto w-[80%]" />
        </div>
        <div>
          <!-- <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-700"
              >邮箱</label
            >
            <x-input
              v-model="email"
              type="email"
              id="email"
              class="mt-2"
              required
            />
          </div> -->
          <form class="mb-6">
            <!-- <label
              for="password"
              class="block text-sm font-medium text-gray-700"
              >邀请码</label
            > -->
            <x-input
              placeholder="邀请码"
              v-model="password"
              type="password"
              class="mt-2"
              required
            />
          </form>
          <x-button :disabled="loading" @click="handleSubmit" class="w-full">
            登录
          </x-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import request from "@/lib/request";
import message from "@/lib/message";

const loading = ref(false);
const router = useRouter();
const email = ref("");
const password = ref("");

const handleSubmit = (event?) => {
  event?.preventDefault();
  // // 处理登录逻辑
  // console.log("Email:", email.value);

  loading.value = true;
  request({
    url: "/login",
    method: "get",
    headers: {
      Authorization: `Bearer ${password.value}`,
    },
  })
    .then((res) => {
      loading.value = false;
      if (res.status === 200) {
        message.success("登录成功");
        localStorage.setItem("apiKey", password.value);
        setTimeout(() => {
          router.push("/");
        }, 30);
      } else {
        message.error(`登录失败：${res.status}`);
      }
    })
    .catch((err) => {
      loading.value = false;
    });
};
</script>
