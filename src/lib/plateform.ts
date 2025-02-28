import { Capacitor } from "@capacitor/core";

export const getPlatform = () => Capacitor.getPlatform();
export const isNativePlatform = () => Capacitor.isNativePlatform();
export const isPluginAvalable = (pluginName: string) =>
  Capacitor.isPluginAvailable(pluginName);
// 屏幕宽度
export const getScreen = () => {
  const width = window.innerWidth;
  let size: "small" | "medium" | "large" | "xlarge" | "2xlarge";

  if (width < 640) {
    size = "small";
  } else if (width >= 640 && width < 768) {
    size = "medium";
  } else if (width >= 768 && width < 1024) {
    size = "large";
  } else if (width >= 1024 && width < 1280) {
    size = "xlarge";
  } else {
    size = "2xlarge";
  }

  return {
    isMobile: width < 1024,
    screenSize: size,
    screenWith: width,
    platform: Capacitor.getPlatform(),
  };
};
export const platformContext = {
  platform: getPlatform(),
  isNative: isNativePlatform(),
};
