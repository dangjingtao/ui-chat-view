import { App } from "vue";
import PluginAComponent from "./view/index.vue";
import { XPlugin } from "../../../Plugins/types";

const PluginA: XPlugin = {
  name: "WebBrowser",
  description: "This is Plugin A",
  activate(app: App) {
    app.component("PluginAComponent", PluginAComponent);
    // 其他激活逻辑
  },
  deactivate() {
    // 停用逻辑
  },
};

export default PluginA;
