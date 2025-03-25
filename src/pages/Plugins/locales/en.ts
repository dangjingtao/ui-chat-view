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
  },
};
