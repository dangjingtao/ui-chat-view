import { createWebHistory, createRouter } from "vue-router";
import { useKnowledgeBaseStore } from "@/store/KnowledgeHub";

const Login = () => import("@/pages/Login/index.vue");
const Home = () => import("@/pages/ChatView/Index.vue");
const Setting = () => import("@/pages/Settings/index.vue");
const Character = () => import("@/pages/ChatCharacters/index.vue");
const KnowledgeHub = () => import("@/pages/KnowledgeHub/index.vue");
const KnowledgeBase = () => import("@/pages/KnowledgeBase/index.vue");
const ResultPage = () => import("@/pages/ResultPage/index.vue");
const About = () => import("@/pages/Settings/components/about.vue");
const ConversationAdvanceSetting = () =>
  import("@/pages/ConversationAdvanceSetting/index.vue");

const routes = [
  { path: "/", component: Home },
  { path: "/characters", component: Character },
  {
    path: "/settings",
    component: Setting,
  },
  { path: "/settings/about", component: About },
  { path: "/knowledge-hub", component: KnowledgeHub },
  {
    path: "/knowledge-base/:id",
    component: KnowledgeBase,
    beforeEnter: async (to, _from, next) => {
      const KnowledgeBaseId = to.params.id;
      const { checkKnowledgeBaseId } = useKnowledgeBaseStore().$service;
      const isExist = await checkKnowledgeBaseId(KnowledgeBaseId);
      if (isExist) {
        return next();
      }
      return next({
        name: "ResultPage",
        params: {
          type: "404",
          title: "抱歉",
          description: "看起来你在访问一个不存在的知识库",
        },
      });
    },
  },
  {
    path: "/resultPage/:type/:title/:description",
    component: ResultPage,
    name: "ResultPage",
  },
  {
    path: "/conversation-advance-setting",
    component: ConversationAdvanceSetting,
  },
  {
    path: "/login",
    component: Login,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
