import { createWebHistory, createRouter } from "vue-router";

import Home from "@/pages/Home/Index.vue";
import Setting from "@/pages/Setting.vue";
import Charactor from "@/pages/Charactors.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/charactors", component: Charactor },
  { path: "/settings", component: Setting },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
