import { createApp } from "vue";
import router from "@/router";
import cachePlugin from "@/plugins/cachePlugin/index";
import "./style.css";
import App from "./App.vue";

createApp(App).use(cachePlugin).use(router).mount("#app");
