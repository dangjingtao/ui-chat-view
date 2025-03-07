import clientCache from "@/plugins/cachePlugin";
import request from "@/lib/request";
import Chat from "@/lib/Chat.ts";
import promptParser from "@/lib/textProcessor/answerParser";
import { getScreen } from "@/lib/plateform";
import wrapWithTryCatch from "@/lib/wrapWithTryCatch";
import message from "@/lib/message";
import _ from "lodash";

const chatService = {
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
    for await (const chunk of stream) {
      chunks += chunk;
      const chatHistory = chatCtx.value.conversation.chatHistory;
      const updatedIndex = chatHistory.findIndex((x) => x.id === message.id);
      if (updatedIndex !== -1) {
        chatHistory[updatedIndex].content = chunks;
      } else {
        chatHistory.push({ ...message, content: chunks });
      }
    }
    delete message.stream;
    const updatedConversation =
      await clientCache.addMessageToCurrentConversationHistory({
        ...message,
        content: chunks,
      });
    this._updateChatContext(chatCtx, updatedConversation);
  },

  chat: new Chat(),

  // 初始化聊天服务
  async init(pageStateContext) {
    //  前端初始化的状态，无任何参考价值
    const { chatCtx } = pageStateContext;
    const chatContext = await clientCache.getChatContext();
    // 在此检查数据一致性

    chatCtx.value = chatContext;

    const URLs = chatCtx.value?.URLs || { models: "" };
    const { data } = await request({ url: URLs.models, method: "GET" });

    chatCtx.value.models = data.map((x) => ({ id: x.id, name: x.id }));

    if (
      chatCtx.value.conversation &&
      chatCtx.value.provider !== chatCtx.value.conversation.provider
    ) {
      message.warning(
        "检查到你换了模型提供商，已尝试为你自动合并到本地储存。但你仍然需要选择模型",
      );
      const post = _.cloneDeep({
        URLs: chatCtx.value.URLs,
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
  },

  // 处理初始化错误
  handleUIError(e, pageStateContext) {
    const { globalInfoList } = pageStateContext;
    const errorMessage: string = (e as any)?.message || "Unknown error";
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
    const { model, provider, URLs, apiKey, systemPrompt, charactorId } =
      chatCtx.value;
    const newConversation = {
      title: "New Conversation",
      model,
      provider,
      URLs,
      apiKey,
      systemPrompt,
      charactorId,
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
    const { chatCtx } = pageStateContext;
    const { conversations: newConversations } =
      await clientCache.deleteConversation(conversationId);
    if (conversationId === chatCtx.value.conversation?.id) {
      this._updateChatContext(chatCtx, null, newConversations);
      chatCtx.value = {
        ...chatCtx.value,
        conversation: null,
        conversations: newConversations,
      };
    } else {
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

  toggleDrawer(isDrawerOpen) {
    isDrawerOpen.value = !isDrawerOpen.value;
  },

  async onOpenCharactors({ isSideBarOpen, loadComponent, router }) {
    const { isMobile } = getScreen();

    if (isMobile) {
      router.push("/characters");
      // chatStore.isSideBarOpen = !chatStore.isSideBarOpen;
      return;
    } else {
      await loadComponent("pages/ChatCharacters/index");
      isSideBarOpen.value = !isSideBarOpen.value;
    }
  },

  // 切换对话
  async onChangeConversation(pageStateContext, id) {
    const { chatCtx, globalInfoList } = pageStateContext;
    const conversation = await clientCache.setConversation(id);
    this.init(pageStateContext);
    this._updateChatContext(chatCtx, conversation);
    globalInfoList.value = [];
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
      if (!has_systemPrompt) {
        result.infoArray.push({
          name: "system_prompt",
          props: { id: chatCtx.value.conversation?.charactor?.id },
        });
      }

      let currentConversation = await clientCache.getCurrentConversation();

      if (!currentConversation) {
        currentConversation = await this.onAddConversation(pageStateContext);
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
        await this._addMessageToHistory(reply, chatCtx);
        if (reply.title) {
          const updatedConversations =
            await clientCache.updateConversationTitle(reply.title);
          chatCtx.value = {
            ...chatCtx.value,
            conversations: updatedConversations,
          };
        }
      } catch (error) {
        this.handleUIError(error, pageStateContext);
      } finally {
        isSending.value = false;
      }
    }
  },

  // 应用角色
  async useCharactor(pageStateContext, charactor) {
    const { chatCtx } = pageStateContext;
    const newConversation = await clientCache.updateCharacter(charactor);

    if (!newConversation) {
      chatCtx.value = {
        ...chatCtx.value,
        charactor: charactor,
      };
    } else {
      this._updateChatContext(chatCtx, newConversation);
    }
    message.success("success");
  },

  // 删除角色
  async clearCharactor(pageStateContext) {
    const { chatCtx } = pageStateContext;
    const newConversation = await clientCache.updateCharacter(null);
    this._updateChatContext(chatCtx, newConversation);
    message.success("删除成功");
  },
};

export default wrapWithTryCatch(chatService);
