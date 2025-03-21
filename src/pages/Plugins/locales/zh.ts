export default {
  Index: {
    pageTitle: "🥒 插件",
  },

  PluginsViews: {
    Index: {
      overview: "概览",

      enable: "启用",
      disable: "禁用",
    },
    Translate: {
      reset: "重置",
      save: "保存",
      // cancel: "取消",
      // name: "名称",
      // nameTooltip: "插件名称",
      // description: "描述",
      // descriptionTooltip: "插件描述",
      // language: "语言",
      // languageTooltip: "插件语言",
      // prompt: "提示词",
      promptTemplate: "提示词模板",
      promptTemplateTooltip: "提示词模板暂时不支持修改，使用默认值即可",
      temperature: "温度",
      maxTokens: "最大tokens",
      maxTokensTooltip: "上下文最大长度，超过该值将被截断",
      temperatureTooltip:
        "模型的温度，提高温度将让模型更具创造性的回答，如果你想要精确的翻译，建议为0",
      anyLanguage: "任何语言",
    },

    ComfyUI: {
      reset: "重置",
      save: "保存",
      domainSettingsTooltip:
        "处于安全性考虑。建议一般都是使用默认值（也就是本机的comfyui服务），除非你做外网映射",
      domainSettings: "域名",
      upload: "上传",
      workflow: "工作流",
      jsonMode: "JSON 模式",
      editMode: "可视化",
      execute: "执行",
    },
  },
};
