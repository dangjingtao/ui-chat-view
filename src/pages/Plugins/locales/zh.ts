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
      jsonMode: "JSON 预览",
      editMode: "编辑模式",
      execute: "执行",
    },

    WebReader: {
      question: "问题",
      url: "网址",
    },

    GptSoVitsV3: {
      exampleAudio: "参考音频",
      exampleLanguageTooltip: "参考音频的语言类型",
      exampleAudioTooltip: "上传 3~10 秒的参考音频，超过会报错",
      exampleText: "参考文本",
      exampleTextHolder: "参考音频对应的文本内容",
      language: "参考语种",
      targetText: "目标文本",
      targetLanguage: "目标语言",
      targetLanguageTooltip: "目标文本的语言类型，最好和参考音频语言一致",
      splitType: "切割方式",
      splitTypeTooltip: "音频切割方式",
      samplingStep: "采样步数",
      samplingStepTooltip:
        "增加步数可提高质量但会变慢，降低步数可加快速度但可能影响质量。",
      speechRate: "语速",
      speechRateTooltip: "控制语音速度",
      temperature: "温度",
      temperatureTooltip: "控制生成随机性",
      seed: "是否开启随机种子",
      topK: "Top K",
      topKTooltip: "控制生成多样性",
      topP: "Top P",
      topPTooltip: "控制生成概率分布",
      sentencePause: "句间停顿秒数",
      sentencePauseTooltip: "句与句之间的停顿时间",
      formValidateMessage: "请填写参考音频或参考文本",
      fetchSampleAudioError: "加载示例音频失败，请稍后重试",
      processError: "处理失败，请稍后重试",
      execute: "处理",
      executeSuccess: "推理成功",
    },

    Rag: {
      embedding: "嵌入",
      databaseSelection: "数据库选择",
      databaseTooltip:
        "UI Chat改造了langchain中极为难用的Close Vector集成，让它支持浏览器端储存。如果你选择内存，每次都会重新调用向量化，相当费token。",
      memory: "内存",
      closeVector: "Close Vector",
      chunk: "分块",
      chunkOverlap: "分块重叠",
      chunkIdentifier: "分块标识符",
      chunkIdentifierTooltip:
        "分隔符是用于分隔文本的字符。\n\n和 \n 是常用于分隔段落和行的分隔符。用逗号连接分隔符(\nn,\n)，当段落超过最大块长度时，会按行进行分割。你也可以使用自定义的特殊分隔符(例如 ***)",
      retrievalLimit: "引用计数",
      retrievalLimitTooltip: "大模型回答时最大的引用数量",
      loadKnowledgeBase: "加载知识库",
      uploadAndVectorize: "上传文档并向量化",
      query: "查询",
      inputYourQuestion: "输入你的问题",
      execute: "执行",
      originalText: "原始文本",
      chunkedText: "分块文本",
      defaultResult:
        "我是深谙民情的砖家，我特长是向群众建议。所以当上了人大代表。",
      noKnowledgeBaseUploaded: "当前没上传知识库文档",
      uploadSuccess: "上传成功",
      chunkSuccess: "分块成功",
      defaultQuestion: "莫洛托夫鸡尾酒是啥?",
      clearDB: "清除向量数据库",
      clearDBConfirm:
        "清除向量数据库后，你将可以重新上传新的知识库文档，是否继续？",
    },
  },
};
