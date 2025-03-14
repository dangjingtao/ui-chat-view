import { createI18n, useI18n } from "vue-i18n";
import en from "./locales/en-US.json";
import zh from "./locales/zh-CN.json";
const savedLocale = localStorage.getItem("locale") || "zh";

const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: "en",
  globalInjection: true,
  messages: {
    en,
    zh,
  },
});

// 动态加载模块翻译文件
export function loadModuleTranslations(modulePath) {
  const enModule = import(`@/${modulePath}/locales/en.ts`);
  const zhModule = import(`@/${modulePath}/locales/zh.ts`);

  enModule.then((module) => {
    i18n.global.setLocaleMessage("en", {
      ...i18n.global.messages.value.en,
      ...module.default,
    });
  });

  zhModule.then((module) => {
    i18n.global.setLocaleMessage("zh", {
      ...i18n.global.messages.value.zh,
      ...module.default,
    });
  });
}

export function useNamespace(namespace: string) {
  const { t } = useI18n();

  const namespacedT = (key: string, ...args: any[]) => {
    return t(`${namespace}.${key}`, ...args);
  };

  return {
    t: namespacedT,
  };
}

export const getLanguage = () => {
  const lang = localStorage.getItem("locale") || "zh";
  const languageMap = {
    zh: "Chinese",
    en: "English",
  };
  return languageMap[lang];
};

export const useLocale = () => {
  const { locale } = useI18n();
  const setLocale = (lang: "cn" | "en") => {
    locale.value = lang;
    localStorage.setItem("locale", lang);
  };

  const getLocale = () => {
    const language = localStorage.getItem("locale") || "zh";
    return language;
  };

  return { getLocale, setLocale };
};

// loadModuleTranslations("pages/Settings");

export default i18n;
