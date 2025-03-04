import { createWebHistory, createRouter } from "vue-router";

const Home = () => import("@/pages/ChatView/Index.vue");
const Setting = () => import("@/pages/Settings/index.vue");
const Charactor = () => import("@/pages/ChatCharactors/index.vue");
const KnowledgeHub = () => import("@/pages/KnowledgeHub/index.vue");

const routes = [
  { path: "/", component: Home },
  { path: "/charactors", component: Charactor },
  { path: "/settings", component: Setting },
  { path: "/knowledge-hub", component: KnowledgeHub },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
