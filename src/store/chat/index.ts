import { defineStore } from "pinia";
import { ref, computed } from "vue";
import homeService from "@/store/chat/service";
import injectContextToMethods from "@/lib/injectContextToMethods";
import { Message } from "@/components/XMessage.vue";
import useDynamicComponent from "@/hooks/useDynamicComponent";
import { useRouter } from "vue-router";
import type { ChatContext } from "@/plugins/cachePlugin/types";

interface Option {
  id: string;
  name: string;
}

interface GlobalContext extends ChatContext {
  conversations: any[];
  models: Option[];
}

interface ToolsCallSetting {
  comfyUI: boolean;
  tavilySearch: boolean;
  notion: boolean;
}

export type ConversationConfig = {
  topK?: number; // 0~100 step 0.5
  topP?: number; // 0~1 /0.01
  temperature?: number; // 0~2
  frequencyPenalty?: number; // 频率惩罚 Frequency Penalty -2~2
  presencePenalty?: number; // 存在惩罚 -2~2
  systemPrompt?: string;
  context?: number; // 0~2048

  conversationPluginSettings: any;

  // repeatPenalty?: number; //重复惩罚
  // numPredict?: number; //此选项设置了模型在回答中可以生成的最大 Token 数。增加这个限制可以让模型提供更长的答案，但也可能增加生成无用或不相关内容的可能性。 (默认值：128）
  // seed?: number; // any number
};

export const useChatStore = defineStore("chat", () => {
  const chatCtx = ref<GlobalContext>({
    model: "",
    provider: "",
    conversation: null,
    systemPrompt: "",
    models: [],
    conversations: [],
    character: null,
  });

  // 左侧侧边栏是否打开
  const isSideBarOpen = ref(false);
  // 右侧对话菜单
  const isDrawerOpen = ref(false);
  // 发送中
  const isSending = ref(false);
  // 系统消息列表
  const globalInfoList = ref<Message[]>([]);
  // 页面loading
  const pageLoading = ref(true);

  const defaultConversationPluginSettings = {
    comfyUI: false,
    tavilySearch: false,
    notion: true,
  };

  // const conversationPluginSettings = ref<ToolsCallSetting>(
  //   defaultConversationPluginSettings,
  // );

  // 这不是一个响应式对象
  const conversationConfig = computed(() => {
    return {
      ...chatCtx.value.defaultAdvanceOptions, // 优先度最低
      ...chatCtx.value.conversation?.advanceOptions, // 优先度中
      systemPrompt:
        chatCtx.value.conversation?.advanceOptions?.systemPrompt ||
        chatCtx.value.conversation?.character?.zh?.prompt ||
        chatCtx.value.defaultAdvanceOptions?.systemPrompt,
      conversationPluginSettings:
        chatCtx.value.conversation?.advanceOptions
          ?.conversationPluginSettings || defaultConversationPluginSettings,
    };
  });

  // 这个只是一个输入控件的值。需要响应初始化
  // const conversationConfig = ref<ConversationConfig>(systemDefaultConfig);

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
    isDrawerOpen,
    conversationConfig,
    pageLoading,
  };

  // 批量注入状态到方法，不用再把所有方法显式声明一次了。
  const $service = injectContextToMethods(homeService, pageStateContext, [
    "chat",
  ]);

  return {
    chatCtx,
    conversations,
    isSideBarOpen,
    isDrawerOpen,
    isSending,
    models,
    globalInfoList,
    hasError,
    isEmptyConversation,
    conversationId,
    defaultCtx,
    chatHistory,
    currentComponent,
    conversationConfig,
    pageLoading,
    // conversationPluginSettings,
    $service,
  };
});
