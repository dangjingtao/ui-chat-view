// plugins/index.ts
import { App } from "vue";
import { IPlugin } from "../../Plugins/types/plugin";

const plugins: IPlugin[] = [];

export function registerPlugin(plugin: IPlugin) {
  plugins.push(plugin);
}

export function activatePlugins(app: App) {
  plugins.forEach((plugin) => {
    plugin.activate(app);
  });
}

export function deactivatePlugins() {
  plugins.forEach((plugin) => {
    plugin.deactivate();
  });
}
