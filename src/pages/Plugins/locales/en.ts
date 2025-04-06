export default {
  Index: {
    pageTitle: "🥒 Plugins",
  },

  PluginsViews: {
    Index: {
      overview: "Overview",

      enable: "Enable",
      disable: "Disable",
    },
    Translate: {
      reset: "Reset",
      save: "Save",
      promptTemplate: "Prompt Template",
      promptTemplateTooltip:
        "The prompt template is not currently editable. Use the default value.",
      temperature: "Temperature",
      maxTokens: "Max Tokens",
      maxTokensTooltip:
        "The maximum number of tokens to generate in the chat message. This is the maximum number of tokens that will be generated, not the maximum number of characters.",
      temperatureTooltip:
        "The model's temperature. Increasing the temperature will make the model's responses more creative.",
      anyLanguage: "Any Language",
    },
    ComfyUI: {
      reset: "Reset",
      save: "Save",
      domainSettingsTooltip:
        "For security reasons, it is generally recommended to use the default value (i.e., the local ComfyUI service) unless you are doing external network mapping.",
      domainSettings: "Domain",
      upload: "Upload",
      workflow: "Workflow",
      jsonMode: "JSON Preview",
      editMode: "Edit Mode",
      execute: "Execute",
    },
    WebReader: {
      question: "Question",
      url: "URL",
    },
    GptSoVitsV3: {
      exampleAudio: "Example Audio",
      exampleLanguageTooltip: "The language type of the example audio",
      exampleAudioTooltip:
        "Upload 3~10 seconds of example audio, exceeding this will cause an error",
      exampleText: "Example Text",
      exampleTextHolder: "The text content corresponding to the example audio",
      language: "Example Language",
      targetText: "Target Text",
      targetLanguage: "Target Language",
      targetLanguageTooltip:
        "The language type of the target text, preferably consistent with the example audio language",
      splitType: "Split Type",
      splitTypeTooltip: "Audio splitting method",
      samplingStep: "Sampling Steps",
      samplingStepTooltip:
        "Increasing steps can improve quality but slow down the process, decreasing steps can speed up the process but may affect quality.",
      speechRate: "Speech Rate",
      speechRateTooltip: "Control the speed of speech",
      temperature: "Temperature",
      temperatureTooltip: "Control the randomness of generation",
      seed: "Enable Random Seed",
      topK: "Top K",
      topKTooltip: "Control the diversity of generation",
      topP: "Top P",
      topPTooltip: "Control the probability distribution of generation",
      sentencePause: "Sentence Pause (seconds)",
      sentencePauseTooltip: "The pause time between sentences",
      formValidateMessage: "Please fill in the example audio or example text",
      fetchSampleAudioError:
        "Failed to load sample audios, please try again later",
      processError: "Processing failed, please try again later",
      execute: "Execute",
      executeSuccess: "Success",
    },
  },
};
