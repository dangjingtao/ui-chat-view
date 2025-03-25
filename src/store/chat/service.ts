import clientCache from "@/plugins/cachePlugin";
import Chat from "@/lib/Chat";
import promptParser from "@/lib/textProcessor/answerParser";
import { getScreen } from "@/lib/platform";
import wrapWithTryCatch from "@/lib/wrapWithTryCatch";
import message from "@/lib/message";
import _ from "lodash";
import { toRaw } from "vue";
import { createPageWithContent, getBot } from "@/pages/Plugins/apis/notion.api";
import dayjs from "dayjs";

const chatService = {
  chat: new Chat(),

  // 更新聊天上下文
  _updateChatContext(chatCtx, updatedConversation, newConversations = null) {
    chatCtx.value = {
      ...chatCtx.value,
      conversation: updatedConversation,
      ...(newConversations ? { conversations: newConversations } : {}),
    };
  },

  // 添加消息到历史记录
  async _addMessageToHistory(message, chatCtx) {
    const { stream } = message;

    if (!stream) {
      const updatedConversation =
        await clientCache.addMessageToCurrentConversationHistory(message);

      this._updateChatContext(chatCtx, updatedConversation);
    } else {
      await this._processStream(stream, message, chatCtx);
    }
  },

  // 处理消息流
  async _processStream(stream, message, chatCtx) {
    let chunks = "";
    const updateChatHistory = _.throttle(
      (chunks: string, chatHistory: any[], message: any) => {
        const updatedIndex = chatHistory.findIndex((x) => x.id === message.id);
        if (updatedIndex !== -1) {
          chatHistory[updatedIndex].content = chunks;
        } else {
          chatHistory.push({ ...message, content: chunks });
        }
      },
      100,
    ); // 每100ms更新一次

    for await (const chunk of stream) {
      chunks += chunk;
      const chatHistory = chatCtx.value.conversation.chatHistory;
      updateChatHistory(chunks, chatHistory, message);
    }

    delete message.stream;
    const updatedConversation =
      await clientCache.addMessageToCurrentConversationHistory({
        ...message,
        content: chunks,
      });
    this._updateChatContext(chatCtx, updatedConversation);
  },

  // 初始化聊天服务
  async init(pageStateContext) {
    //  前端初始化的状态，无任何参考价值
    const { chatCtx, conversationConfig, pageLoading } = pageStateContext;
    const chatContext = await clientCache.getChatContext();
    // 在此检查数据一致性
    console.log("init", chatCtx, conversationConfig);
    chatCtx.value = chatContext;

    if (
      chatCtx.value.conversation &&
      chatCtx.value.provider !== chatCtx.value.conversation.provider
    ) {
      message.warning(
        "检查到你换了模型提供商，已尝试为你自动合并到本地储存。但你仍然需要选择模型",
      );
      const post = _.cloneDeep({
        baseURL: chatCtx.value.baseURL,
        apiKey: chatCtx.value.apiKey,
        provider: chatCtx.value.provider,
        model: "",
      });
      await clientCache.updateConversation(chatCtx.value.conversation.id, post);
      this._updateChatContext(chatCtx, {
        ...chatCtx.value.conversation,
        ...post,
      });
    }
    pageLoading.value = false;
  },

  // 处理初始化错误
  handleUIError(pageStateContext, e) {
    const { globalInfoList } = pageStateContext;
    const errorMessage: string = (e as any)?.message || "Unknown error";
    if (
      errorMessage === "Aborted" ||
      errorMessage ===
        "Failed to execute 'throwIfAborted' on 'AbortSignal': signal is aborted without reason"
    ) {
      message.info("已放弃");
      return;
    }
    const existingIndex = globalInfoList.value.findIndex(
      (item) => item.content === errorMessage,
    );
    if (existingIndex === -1) {
      globalInfoList.value.push({
        code: (e as any)?.data?.code || "500",
        content: errorMessage,
        type: "danger",
      });
    }
  },

  removeGlobalInfo(pageStateContext, index) {
    const { globalInfoList } = pageStateContext;
    globalInfoList.value = globalInfoList.value.filter(
      (item, i) => i !== index,
    );
  },

  // 选择模型
  async onSelectModel(pageStateContext, id) {
    const { chatCtx, globalInfoList } = pageStateContext;
    const newConversation =
      await clientCache.updateCurrentConversationModel(id);
    this._updateChatContext(
      chatCtx,
      newConversation || chatCtx.value.conversation,
    );

    // 删除model提示
    const filteredList = globalInfoList.value.filter((x) => x.code !== "model");
    globalInfoList.value = filteredList;
  },

  // 删除消息
  async deleteMessage(pageStateContext, message) {
    const { chatCtx } = pageStateContext;
    const { id } = message;
    const updatedConversation =
      await clientCache.deleteMessageFromCurrentConversationHistory(id);
    this._updateChatContext(chatCtx, updatedConversation);
  },

  // 重新生成消息
  async regenerate(pageStateContext, message) {
    const { chatCtx } = pageStateContext;
    const index = chatCtx.value.conversation.chatHistory.findIndex(
      (x) => x.id === message.id,
    );

    const { updatedConversation, lastUserMessage } =
      await clientCache.removeMessageSinceCurrentConversationHistory(index);
    this._updateChatContext(chatCtx, updatedConversation);

    await this.onSend(pageStateContext, lastUserMessage);
  },

  // 添加新对话
  async onAddConversation(pageStateContext) {
    const { chatCtx } = pageStateContext;
    const {
      model,
      provider,
      baseURL,
      apiKey,
      systemPrompt,
      characterId,
      // conversations,
    } = chatCtx.value;

    const newConversation = {
      title: "New Conversation",
      model,
      provider,
      baseURL,
      apiKey,
      systemPrompt,
      characterId,
    };

    const {
      conversations: newConversations,
      conversation: updatedConversation,
    } = await clientCache.addConversation(newConversation);

    this._updateChatContext(chatCtx, updatedConversation, newConversations);

    return await newConversations;
  },

  // 删除对话
  async onDeleteConversation(pageStateContext, conversationId) {
    const { chatCtx, isSending } = pageStateContext;

    // 删除的是当前的
    if (conversationId === chatCtx.value.conversation?.id) {
      if (isSending.value) {
        message.warning("正在发送消息，请稍后再试");
      } else {
        const { conversations: newConversations } =
          await clientCache.deleteConversation(conversationId);
        this._updateChatContext(chatCtx, null, newConversations);
        chatCtx.value = {
          ...chatCtx.value,
          model: "",
          conversation: null,
          conversations: newConversations,
        };
      }
    } else {
      const { conversations: newConversations } =
        await clientCache.deleteConversation(conversationId);
      chatCtx.value = {
        ...chatCtx.value,
        conversations: newConversations,
      };
    }
  },

  closeSideBar(pageStateContext) {
    const { isSideBarOpen } = pageStateContext;
    isSideBarOpen.value = false;
  },

  toggleDrawer({ isDrawerOpen }) {
    isDrawerOpen.value = !isDrawerOpen.value;
  },

  // 打开角色卡面板
  async onOpenCharactersSidebar({ isSideBarOpen, loadComponent, router }) {
    const { isMobile } = getScreen();

    if (isMobile) {
      router.push("/characters");
      // chatStore.isSideBarOpen = !chatStore.isSideBarOpen;
      return;
    } else {
      await loadComponent("pages/ChatCharacters/index");
      isSideBarOpen.value = true;
    }
  },

  // 打开高级设置面板
  async onOpenConversationAdvanceSettingSidebar({
    isSideBarOpen,
    loadComponent,
    router,
  }) {
    const { isMobile } = getScreen();

    if (isMobile) {
      router.push("/conversation-advance-setting");
      // chatStore.isSideBarOpen = !chatStore.isSideBarOpen;
      return;
    } else {
      await loadComponent("pages/ConversationAdvanceSetting/index");
      isSideBarOpen.value = true;
    }
  },

  // 切换对话
  async onChangeConversation(pageStateContext, id) {
    // 在发送中时，应当阻止切换
    const { isSending, isSideBarOpen } = pageStateContext;
    if (isSending.value) {
      message.warning("正在发送消息，请稍后再试");
      return;
    } else {
      const { chatCtx, globalInfoList } = pageStateContext;
      globalInfoList.value = [];
      const conversation = await clientCache.setConversation(id);
      //! 为了隐藏一个bug,侧边栏不更新
      isSideBarOpen.value = false;
      this._updateChatContext(chatCtx, conversation);
      this.init(pageStateContext);
    }
  },

  // 发送消息
  async onSend(pageStateContext, message) {
    const { chatCtx, globalInfoList, isSending } = pageStateContext;
    const hasError = globalInfoList.value.find((x) => x.type === "danger");

    if (!hasError) {
      isSending.value = true;
      const { content } = message;
      const result = promptParser(content);

      // 注入角色卡逻辑，优先指令，其次角色卡
      const has_systemPrompt = result.infoArray.find(
        (info) => info.name === "system_prompt",
      );

      // 通过指令的形式注入角色提示词
      if (!has_systemPrompt) {
        result.infoArray.push({
          name: "system_prompt",
          props: { id: chatCtx.value.conversation?.character?.id },
        });
      }

      let currentConversation = await clientCache.getCurrentConversation();

      if (!currentConversation) {
        // currentConversation = await this.onAddConversation(pageStateContext);
        message.warning("请先创建一个对话吧");
        return;
      }

      await this._addMessageToHistory(
        {
          ...message,
          content: result.content,
          directive: result.infoArray,
        },
        chatCtx,
      );

      try {
        const reply = await this.chat.sendMessage();
        requestAnimationFrame(() => {
          this._addMessageToHistory(reply, chatCtx);
        });

        if (reply.title) {
          const updatedConversations =
            await clientCache.updateConversationTitle(reply.title);
          chatCtx.value = {
            ...chatCtx.value,
            conversations: updatedConversations,
          };
        }
      } catch (error) {
        this.handleUIError(pageStateContext, error);
      } finally {
        isSending.value = false;
      }
    }
  },

  async onStopSend(pageStateContext) {
    const isSending = pageStateContext.isSending;
    isSending.value = false;
    this.chat.abort();
  },

  // 应用角色
  async useCharacter(pageStateContext, character) {
    const { chatCtx } = pageStateContext;
    const newConversation = await clientCache.updateCharacter(character);

    this._updateChatContext(chatCtx, newConversation);

    message.success("success");
  },

  // 删除角色
  async clearCharacter(pageStateContext) {
    const { chatCtx, conversationConfig } = pageStateContext;
    const newConversation = await clientCache.updateCharacter(null);
    this._updateChatContext(chatCtx, newConversation);

    message.success("删除成功");
  },

  // 对话高级参数更新
  // + 包括其它工具
  async updateConversationAdvanceSetting(pageStateContext, data) {
    const { chatCtx } = pageStateContext;
    if (!chatCtx.value.conversation) {
      message.error("未创建对话");
      return;
    } else {
      data = toRaw(data);
      data.conversationPluginSettings = toRaw(data.conversationPluginSettings);
      const newConversation =
        await clientCache.updateConversationAdvanceSetting(data);
      this._updateChatContext(chatCtx, newConversation);
    }
  },
  // 帮我用markdown写一个表格。表格里包含服务商，时间
  async saveToNotion(pageStateContext, data) {
    try {
      const { chatCtx } = pageStateContext;
      if (!chatCtx.value.conversation) {
        message.error("未创建对话");
        return;
      } else {
        const notionData = await getBot();
        const { timeStamp, content } = data;

        const conversation = chatCtx.value.conversation;

        const {
          title,
          id,
          chatHistory,
          model,
          provider,
          createTime,
          character,
        } = conversation;

        let lastUserMessage = "";
        const lastUserMessageIndex =
          chatHistory.findIndex((message) => message.id === data.id) - 1;

        if (lastUserMessageIndex >= 0) {
          lastUserMessage = chatHistory[lastUserMessageIndex]?.content;
        }

        const pageTitle = `[UIChat] ${title || id}`;

        const stringTemplate = `
| 服务商 | 所用模型 | 对话创建时间 | 回复生成时间 | 角色卡[${character?.zh?.title || "无"}]附加的系统提示词 |
| ------ | -------- | -------- | -------- | ------ |
| ${provider} | ${model} | ${dayjs(createTime).format("YYYY-MM-DD HH:mm:ss")} | ${dayjs(data?.timeStamp).format("YYYY-MM-DD HH:mm:ss")} | ${character?.zh?.prompt || "-"} |

**## [用户]：${lastUserMessage}**

${data.content}
`;
        await createPageWithContent(pageTitle, stringTemplate);
        message.success("你的文档片段已成功发送到notion");
        console.log(stringTemplate);
      }
      // createPageWithContent()
    } catch (error) {
      message.error(error.message);
      return;
    }
  },
};

export default wrapWithTryCatch(chatService);
