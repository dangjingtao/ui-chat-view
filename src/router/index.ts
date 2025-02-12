import { createMemoryHistory, createRouter } from "vue-router";

import HomeView from "@/blocks/MobileChat.vue";
// import AboutView from "./AboutView.vue";

const routes = [
  { path: "/", component: HomeView },
  // { path: "/about", component: AboutView },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

export default router;
