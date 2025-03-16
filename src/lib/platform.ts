import { Capacitor } from "@capacitor/core";

export const getPlatform = () => Capacitor.getPlatform();
export const isNativePlatform = () => Capacitor.isNativePlatform();
export const isPluginAvailable = (pluginName: string) =>
  Capacitor.isPluginAvailable(pluginName);

// 屏幕宽度
export const getScreen = () => {
  const width = window.innerWidth;
  let size: "small" | "medium" | "large" | "x_large" | "2x_large";

  if (width < 640) {
    size = "small";
  } else if (width >= 640 && width < 768) {
    size = "medium";
  } else if (width >= 768 && width < 1024) {
    size = "large";
  } else if (width >= 1024 && width < 1280) {
    size = "x_large";
  } else {
    size = "2x_large";
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

export const getOperatingSystem = () => {
  const userAgent = navigator.userAgent || navigator.vendor;

  if (/windows phone/i.test(userAgent)) {
    return "Windows Phone";
  }

  if (/android/i.test(userAgent)) {
    return "Android";
  }

  if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
    return "iOS";
  }

  if (/Win/i.test(userAgent)) {
    return "Windows";
  }

  if (/Mac/i.test(userAgent)) {
    return "MacOS";
  }

  if (/Linux/i.test(userAgent)) {
    return "Linux";
  }

  return "Unknown";
};
