import { createApp, h, ref } from "vue";
import XDialog from "@/components/XDialog.vue";

const Modal = {
  confirm({
    title,
    message,
    type,
    injectHtml,
  }: {
    title?: string;
    message?: string;
    type: "info" | "danger" | "alert" | "prompt";
    injectHtml: boolean;
  }) {
    return new Promise((resolve) => {
      const visible = ref(true);
      const destroy = () => {
        app.unmount();
        document.body.removeChild(container);
      };

      const app = createApp({
        render() {
          return h(XDialog, {
            type,
            title,
            message,
            injectHtml,
            visible: visible.value,
            "onUpdate:visible": (val) => {
              visible.value = false;
            },
            onConfirm() {
              destroy();
              resolve(true);
            },
            onCancel() {
              destroy();
              resolve(false);
            },
          });
        },
      });

      const container = document.createElement("div");
      document.body.appendChild(container);
      app.mount(container);
    });
  },
};

export default Modal;
