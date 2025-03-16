export default {
  Settings: {
    Index: {
      settings: "Settings",
    },
    GeneralSetting: {
      Settings: "Settings",
      general: "General",
      language: "Language",
      languageDescription:
        "It is not completely useless if you choose now, but it is not very useful",
      simplifiedChinese: "Simplified Chinese",
      english: "English",
      theme: "Theme",
      geekblue: "Geek Blue",
      volcano: "Warm Cold",
      gaypurple: "Gay Purple",
      hatgreen: "Hat Green",
      magenta: "Magenta",
      darkMode: "Dark Mode",
    },

    WorkModelSetting: {
      customerBaseURL: "Customer Provider Domain:",
      openProxyDescription:
        "* Service provided by Open Proxy API Deno, no need to configure API Key for the provider separately",
      workModelTitle: "Workspace",
      llmProviderName: "LLM Provider",
      imageGenerationSchemeName: "Image Generation Scheme",
      imageGenerationSchemeDescription: "Not yet implemented",
      ttsSchemeName: "TTS Scheme",
      ttsSchemeDescription: "Not yet implemented",
      setSuccess: "Set successfully",
    },

    //
    TaskLLMSetting: {
      llmTaskModel: "LLM Task Model",
      llmTaskProvider: "LLM Task Provider",
      llmTaskDescription:
        "LLM tasks refer to the tasks you perform daily in the agent",
      llmTaskModelDescription:
        "Different from daily chat tasks, you need to set it manually",
      modelListUpdated:
        "The provider has updated the model list, please reset the LLM task model",
      updateFailed: "Update failed",
      initFailed: "Initialization failed",
      providerUpdateFailed: "Provider update failed",
      modelUpdateFailed: "Model update failed",
    },

    TaskEmbedSetting: {
      llmEmbedModel: "Embedding Task Model",
      embeddingProvider: "Embedding Provider",
      embeddingProviderDescription:
        "Provider of vector models, UIChat will help you filter out unsuitable ones",
      embeddingModel: "Embedding Model",
      modelListUpdated:
        "The provider has updated the model list, please reset the embedding task model",
      updateFailed: "Update failed",
      initFailed: "Initialization failed",
      providerUpdateFailed: "Provider update failed",
      modelUpdateFailed: "Model update failed",
      setSuccess: "Set successfully",
    },

    // 关于
    AboutSetting: {
      aboutUs: "About",
      uiChat: "UI Chat",
      aiExperience: "AI Experience New Order",
      checkUpdate: "Check Update",
      fixUpdateBug: "Fix Update Bug",
      clearLocalChat: "Your local chat history will be cleared",
      deleteLocalStorage: "Delete Local Storage",
      updateLog: "Update Log",
      officialWebsite: "Official Website",
      license: "License",
      feedback: "Feedback",
      view: "View",
      email: "Mail",
      latestVersion: "The latest version is",
      deleteLocalStorageMessage:
        "Deleting local storage will reset all conversation information. You will need to log in again. Do you want to continue?",
      clearSuccess: "Clear successful",
    },
  },
};
