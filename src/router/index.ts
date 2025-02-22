import { createWebHistory, createRouter } from "vue-router";

import Home from "@/pages/Home.vue";
import Setting from "@/pages/Setting.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/settings", component: Setting },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
