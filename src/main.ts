import "core-js/stable";
import "regenerator-runtime/runtime";
import { createApp } from "vue";
import router from "@/router";
import cachePlugin from "@/plugins/cachePlugin/index";
import App from "./App.vue";
import "./styles/index.css";

cachePlugin.install().then(() => {
  createApp(App).use(router).mount("#app");
});
