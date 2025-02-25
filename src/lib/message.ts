import { createApp, h } from "vue";
import XMsg from "@/components/XMsg.vue";

function showMessage({ type, message }) {
  const container = document.createElement("div");
  document.body.appendChild(container);

  const app = createApp({
    render() {
      return h(XMsg, { type, message });
    },
  });

  app.mount(container);

  setTimeout(() => {
    app.unmount();
    document.body.removeChild(container);
  }, 3500); // 3秒显示时间 + 0.5秒动画时间
}

export default {
  info(message) {
    showMessage({ type: "info", message });
  },
  warning(message) {
    showMessage({ type: "warning", message });
  },
  success(message) {
    showMessage({ type: "success", message });
  },
  error(message) {
    showMessage({ type: "error", message });
  },
};
