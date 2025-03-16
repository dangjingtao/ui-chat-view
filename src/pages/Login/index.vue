<template>
  <div
    :style="{ backgroundImage: `url(${loginBg})`, backgroundSize: '100% 100%' }"
    class="flex h-full items-center justify-center"
  >
    <div class="flex w-full max-w-4xl items-center">
      <!-- <div
        class="hidden w-2/3 bg-cover bg-center lg:block"
        style="background-image: url(&quot;your-image-url.jpg&quot;)"
      ></div> -->
      <div
        class="card m-auto -mt-64 w-full max-w-sm rounded-lg bg-[rgba(255,255,255,0.6)] p-5 shadow-xl backdrop-blur-md"
      >
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
              class="bg-red mt-2"
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
import loginBg from "@/assets/images/loginbg.png";

const loading = ref(false);
const router = useRouter();
const password = ref("");

const handleSubmit = async (event?) => {
  event?.preventDefault();
  // // 处理登录逻辑
  // console.log("Email:", email.value);

  loading.value = true;
  request({
    url: "/login",
    method: "post",
    data: {
      invitationCode: password.value,
    },
  })
    .then((res) => {
      loading.value = false;
      if (res.status === 200) {
        message.success("登录成功");
        localStorage.setItem("apiKey", res?.data?.token);
        router.push("/");
      } else {
        message.error(`登录失败：${res.error}`);
        localStorage.clear();
      }
    })
    .catch((err) => {
      console.error(err);
      loading.value = false;
    });
};
</script>

<style scoped>
.card {
  position: relative;
}

.card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* box-shadow: inset 0 0 10px rgba(118, 115, 253, 0.1); */
  border-radius: inherit; /* 保持圆角 */
  pointer-events: none; /* 确保阴影不影响内容的交互 */
}
</style>
