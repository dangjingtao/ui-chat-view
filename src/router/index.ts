import { createWebHistory, createRouter } from "vue-router";
import { useKnowledgeBaseStore } from "@/store/KnowledgeHub";
import { checkUpdate } from "@/lib/pwa";

const Login = () => import("@/pages/Login/index.vue");
const Home = () => import("@/pages/ChatView/Index.vue");
const Setting = () => import("@/pages/Settings/index.vue");
const Character = () => import("@/pages/ChatCharacters/index.vue");
const KnowledgeHub = () => import("@/pages/KnowledgeHub/index.vue");
const KnowledgeBase = () => import("@/pages/KnowledgeBase/index.vue");
const ResultPage = () => import("@/pages/ResultPage/index.vue");
const MicroApps = () => import("@/pages/MicroAppsHub/index.vue");
const Plugins = () => import("@/pages/Plugins/index.vue");
const PluginsDetail = () => import("@/pages/Plugins/components/index.vue");

const ConversationAdvanceSetting = () =>
  import("@/pages/ConversationAdvanceSetting/index.vue");

const routes = [
  { path: "/", component: Home },
  { path: "/characters", component: Character },
  {
    path: "/settings",
    component: Setting,
  },
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
  {
    path: "/plugins",
    component: Plugins,
  },
  {
    path: "/plugins/:id",
    component: PluginsDetail,
  },
  {
    path: "/micro-apps",
    component: MicroApps,
  },
  { path: "/:pathMatch(.*)*", component: ResultPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.afterEach(() => {
  checkUpdate(); // 在每次路由切换时触发更新
});

export default router;
