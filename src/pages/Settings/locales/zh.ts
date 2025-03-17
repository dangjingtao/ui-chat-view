export default {
  Settings: {
    Index: {
      settings: "设置",
    },
    GeneralSetting: {
      Settings: "设置",
      general: "通用",
      language: "语言",
      languageDescription: "除了界面，也会关系到AI与你日常人机对话的语言",
      simplifiedChinese: "简体中文",
      english: "English",
      theme: "主题",
      geekblue: "胖次蓝",
      volcano: "菊花橙",
      gaypurple: "基佬紫",
      hatgreen: "原谅绿",
      magenta: "猛男粉",
      darkMode: "暗黑模式",
    },

    WorkModelSetting: {
      customerBaseURL: "自定义服务商域名:",
      openProxyDescription:
        "* 服务由 Open Proxy API Deno 提供，无需再为服务商单独配置 API Key",
      workModelTitle: "工作空间",
      llmProviderName: "LLM 对话服务商",
      imageGenerationSchemeName: "文生图方案",
      imageGenerationSchemeDescription: "暂未实现",
      ttsSchemeName: "TTS方案",
      ttsSchemeDescription: "暂未实现",
      setSuccess: "设置成功",
    },

    // LLM任务
    TaskLLMSetting: {
      llmTaskModel: "LLM 任务模型",
      llmTaskProvider: "LLM 任务服务商",
      llmTaskDescription: "LLM 任务指的是你在智能体中日常执行的任务",
      llmTaskModelDescription: "与日常聊天的任务有差别，你需要人工设置",
      modelListUpdated: "服务商已更新模型列表，请重新设置LLM任务模型",
      updateFailed: "更新失败",
      initFailed: "初始化失败",
      providerUpdateFailed: "服务商更新失败",
      modelUpdateFailed: "模型更新失败",
    },

    // Embed 任务
    TaskEmbedSetting: {
      llmEmbedModel: "向量化模型",
      embeddingProvider: "Embedding服务商",
      embeddingProviderDescription:
        "提供向量模型的服务商，UIChat会帮你筛选掉不适用的",
      embeddingModel: "Embedding模型",
      modelListUpdated: "服务商已更新模型列表，请重新设置向量任务模型",
      updateFailed: "更新失败",
      initFailed: "初始化失败",
      providerUpdateFailed: "服务商更新失败",
      modelUpdateFailed: "模型更新失败",
      setSuccess: "设置成功",
    },

    AboutSetting: {
      aboutUs: "关于我们",
      uiChat: "UI Chat",
      aiExperience: "AI 体验新秩序",
      checkUpdate: "检查更新",
      fixUpdateBug: "解决更新bug",
      clearLocalChat: "您本地的聊天记录将被清空",
      deleteLocalStorage: "删除本地储存",
      updateLog: "更新日志",
      officialWebsite: "官方网站",
      license: "许可证",
      feedback: "意见反馈",
      view: "查看",
      email: "邮件",
      latestVersion: "最新版本为",
      deleteLocalStorageMessage:
        "删除本地储存将重置所有对话信息。你需要重新登录。确认继续吗？",
      clearSuccess: "清除成功",
    },
  },
};
