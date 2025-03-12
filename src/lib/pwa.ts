import { registerSW } from "virtual:pwa-register";
import { useRegisterSW } from "virtual:pwa-register/vue";
import dialog from "./dialog.ts";
import message from "./message.ts";

declare const __APP_VERSION__: string;
const version = __APP_VERSION__;

export const checkUpdate = registerSW({
  onRegistered(r) {
    r &&
      setInterval(
        () => {
          r.update();
        },
        60 * 60 * 1000,
      );
  },
  async onNeedRefresh() {
    // console.log("新版本可用，请刷新页面以更新。");
    const userConfirmed = await dialog.confirm({
      title: `检测到新版本 v${version}`,
      message: `是否立即更新？`,
      type: "info",
    });
    // const userConfirmed = confirm("检测到新版本，是否立即刷新以应用更新？");
    if (userConfirmed) {
      checkUpdate(); // 激活新版本
    }
  },
  onOfflineReady() {
    message.success("应用已准备好离线使用。");
    console.log("应用已准备好离线使用。");
  },
});

// let channel: any = {};
// if (typeof BroadcastChannel !== "undefined") {
//   channel = new BroadcastChannel("pwa-update-channel");
//   channel.addEventListener("message", (event) => {
//     if (event.data === "refresh") {
//       window.location.reload();
//     }
//   });
// } else {
//   console.warn("BroadcastChannel API is not supported in this browser.");
// }

// export function initPwa() {
//   if ("serviceWorker" in navigator) {
//     const registerFilePath =
//       import.meta.env.MODE === "development" ? "/dev-sw.js" : "/sw.js";
//     navigator.serviceWorker.register(registerFilePath).then((registration) => {
//       registration.addEventListener("updatefound", () => {
//         const newWorker = registration.installing;
//         if (newWorker) {
//           newWorker.addEventListener("statechange", () => {
//             if (
//               newWorker.state === "installed" &&
//               navigator.serviceWorker.controller
//             ) {
//               // 新版本已安装，但未激活
//               channel.postMessage("refresh");
//             }
//           });
//         }
//       });
//     });
//   }
// }
