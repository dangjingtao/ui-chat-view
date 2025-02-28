import { defineStore } from "pinia";
import { ref, computed } from "vue";
import homeService from "@/services/homeService";
import { Message } from "@/components/XMessage.vue";
import useDynamicComponent from "@/hooks/useDynamicCompoment";
import { useRouter } from "vue-router";

interface Option {
  id: string;
  name: string;
}

// 定义 ChatContext 类型
interface ChatContext {
  model: string;
  provider: string;
  conversation: any;
  URLs: {
    models: string;
  };
  systemPrompt: string;
  id?: string; // 会话id
  charactor?: any;
}

interface GlobalContext extends ChatContext {
  conversations: any[];
  models: Option[];
}

export const useChatStore = defineStore("chat", () => {
  const chatCtx = ref<GlobalContext>({
    model: "",
    provider: "",
    conversation: null,
    URLs: {
      models: "",
    },
    systemPrompt: "",
    models: [],
    conversations: [],
    charactor: -1,
  });

  // 左侧侧边栏是否打开
  const isSideBarOpen = ref(false);
  // 发送中
  const isSending = ref(false);
  // 系统消息列表
  const globalInfoList = ref<Message[]>([]);

  const { currentComponent, loadComponent } = useDynamicComponent();

  const router = useRouter();

  const hasError = computed(() =>
    globalInfoList.value.find((x) => x.type === "danger"),
  );

  // 当前的对话上下文，如果没有对话则返回全局上下文
  const defaultCtx = computed(() => {
    const { conversation } = chatCtx.value || {};
    const ctx = conversation || chatCtx.value;
    return ctx;
  });

  // 当前的模型列表 需要从顶层返回
  const models = computed(() => {
    return chatCtx.value.models || [];
  });

  // 当前的对话列表 需要从顶层返回
  const conversations = computed(() => chatCtx.value.conversations || []);

  // 当前的对话id 为null时表示没有对话
  const conversationId = computed(() => {
    return chatCtx.value?.conversation?.id;
  });

  // 当前的对话历史记录，如果没有对话则返回空数组
  const chatHistory = computed(() => {
    const { conversation } = chatCtx.value || {};
    return conversation?.chatHistory || [];
  });

  // 对话历史记录是否为空, 如果没有对话则不显示对话历史记录
  const isEmptyConversation = computed(() => chatHistory.value.length === 0);

  // 给业务方法消费的状态上下文
  const pageStateContext = {
    chatCtx,
    globalInfoList,
    isSending,
    isSideBarOpen,
    currentComponent,
    loadComponent,
    router,
  };

  return {
    chatCtx,
    conversations,
    isSideBarOpen,
    isSending,
    models,
    globalInfoList,
    hasError,
    isEmptyConversation,
    conversationId,
    defaultCtx,
    chatHistory,
    currentComponent,
    $service: {
      init: () => homeService.init(pageStateContext),
      onSelectModel: (id) => homeService.onSelectModel(pageStateContext, id),
      deleteMessage: (message) =>
        homeService.deleteMessage(pageStateContext, message),
      regenerate: (message) =>
        homeService.regenerate(pageStateContext, message),
      onAddConversation: () => homeService.onAddConversation(pageStateContext),
      onDeleteConversation: (conversationId) =>
        homeService.onDeleteConversation(pageStateContext, conversationId),
      onChangeConversation: (id) =>
        homeService.onChangeConversation(pageStateContext, id),
      onSend: (message) => homeService.onSend(pageStateContext, message),
      closeSideBar: (router) =>
        homeService.closeSideBar(pageStateContext, router),
      onOpenCharactors: () => homeService.onOpenCharactors(pageStateContext),
      handleUIError: (error) =>
        homeService.handleUIError(error, pageStateContext),
      useCharactor: (CharactorId) =>
        homeService.useCharactor(pageStateContext, CharactorId),
      chat: homeService.chat,
    },
  };
});
