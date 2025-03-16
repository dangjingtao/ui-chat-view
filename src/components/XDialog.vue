<template>
  <transition name="fade">
    <div v-if="visible" class="fixed inset-0 z-10 bg-[rgba(0,0,0,0.5)]"></div>
  </transition>

  <transition>
    <div
      v-if="visible"
      class="fixed inset-0 z-10 flex items-start justify-center"
    >
      <div
        class="relative w-[90%] min-w-[350px] translate-y-30 rounded-lg bg-white shadow-lg md:w-2/7"
      >
        <a
          href="javascript:;"
          class="absolute top-3 right-3 h-6 w-6 text-gray-500 hover:text-gray-600"
          ><i-mdi-close class="m-auto block" @click="onCancel"
        /></a>
        <div class="p-4 pb-2 text-lg">
          <slot v-if="!type" name="header"></slot>
          <div v-else class="flex text-[16px] font-bold">
            <i-mdi-information-slabCircle
              v-if="props.type === 'alert'"
              class="text-md mt-0.5 text-red-500"
            />
            <i-mdi-information-slabCircle
              v-if="props.type === 'info'"
              class="text-md text-primary-6 mt-0.5"
            />
            &nbsp;&nbsp;{{ displayTitle }}
          </div>
        </div>
        <div class="px-4 py-2">
          <slot v-if="!type" name="body"></slot>
          <div v-else class="text-sm">{{ props.message }}</div>
        </div>
        <div class="flex justify-end gap-2 px-4 py-2">
          <slot name="footer">
            <x-button type="ghost" @click="onCancel">{{ t.cancel }}</x-button>
            <x-button @click="onConfirm">{{ t.confirm }}</x-button>
          </slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed } from "vue";

const lang = localStorage.getItem("locale") || "zh";

const langMap = {
  en: {
    confirm: "Confirm",
    cancel: "Cancel",
    danger: "Danger",
    alert: "Alert",
    prompt: "Info",
  },
  zh: {
    confirm: "确定",
    cancel: "取消",
    danger: "危险",
    alert: "注意",
    prompt: "消息",
  },
};

const t = langMap[lang];
// import { loadModuleTranslations, useNamespace } from "@/i18n";

// loadModuleTranslations("components");
// const { t } = useNamespace("Components");

// console.error(t);

const props = defineProps<{
  message?: string;
  visible: Boolean;
  type?: "info" | "danger" | "alert" | "prompt";
  title?: string;
}>();

const displayTitle = computed(() => {
  if (props.title) {
    return props.title;
  }
  switch (props.type) {
    case "info":
      return t.confirm;
    case "danger":
      return t.danger;
    case "alert":
      return t.alert;
    case "prompt":
      return t.prompt;
    default:
      return "";
  }
});

const emit = defineEmits(["update:visible", "confirm", "cancel"]);

const onConfirm = async () => {
  emit("confirm");
};

const onCancel = async () => {
  emit("update:visible", false);
  emit("cancel");
};
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition:
    opacity 0.1s ease,
    transform 0.1s;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
