import { createApp } from "vue";
import router from "@/router";
import cachePlugin from "@/plugins/cachePlugin/index";
import "./style.css";
import App from "./App.vue";

cachePlugin.install().then(() => {
  createApp(App).use(router).mount("#app");
});
