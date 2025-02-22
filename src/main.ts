import { createApp } from "vue";
import router from "@/router";
import cachePlugin from "@/plugins/cachePlugin/index";
import { MdPreview } from "md-editor-v3";
import "./style.css";
import App from "./App.vue";

cachePlugin.install().then(() => {
  createApp(App).use(router).use(MdPreview).mount("#app");
});
