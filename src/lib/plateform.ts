import { Capacitor } from '@capacitor/core';

export const getPlatform = () => Capacitor.getPlatform();
export const isNativePlatform = () => Capacitor.isNativePlatform()
export const isPluginAvalable = (pluginName: string) => Capacitor.isPluginAvailable(pluginName);

export const platformContext = {
  platform:getPlatform(),
  isNative:isNativePlatform()
};
