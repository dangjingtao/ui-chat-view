import "core-js/stable";
import "regenerator-runtime/runtime";
import { createApp } from "vue";
import router from "@/router";
import cachePlugin from "@/plugins/cachePlugin/index";
import { MdPreview } from "md-editor-v3";
import App from "./App.vue";
import "./style.css";

cachePlugin.install().then(() => {
  createApp(App).use(router).use(MdPreview).mount("#app");
});
