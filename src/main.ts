import "core-js/stable";
import "regenerator-runtime/runtime";
import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "@/router";
import cachePlugin from "@/plugins/cachePlugin/index";
import App from "./App.vue";
import "./styles/index.css";
import { checkUpdate } from "@/lib/pwa";

checkUpdate();

// initPwa();
cachePlugin.install().then(() => {
  createApp(App).use(createPinia()).use(router).mount("#app");
});
