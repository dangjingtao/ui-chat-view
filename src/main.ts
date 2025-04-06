import "core-js/stable";
import "regenerator-runtime/runtime";
import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "@/router";
import i18n from "./i18n";
import cachePlugin from "@/plugins/cachePlugin/index";
import App from "./App.vue";
import "./styles/index.css";
import { checkUpdate } from "@/lib/pwa";
// import { UIChatShadow } from "@/plugins/WebContainer";

// // const _UIChatShadow = new UIChatShadow({});

checkUpdate();

// initPwa();
cachePlugin.install().then(() => {
  const theme = localStorage.getItem("theme") || "geek-blue";
  const colorMode = localStorage.getItem("colorMode");

  document.documentElement.classList.remove();
  if (colorMode) {
    document.documentElement.classList.add(`${colorMode}`);
  }
  document.documentElement.classList.add(`theme-${theme}`);

  const language = localStorage.getItem("language") || "en";
  // document.
  createApp(App).use(createPinia()).use(router).use(i18n).mount("#app");
});
