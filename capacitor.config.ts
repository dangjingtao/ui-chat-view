import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.tomz.uichat",
  appName: "ui-chat",
  webDir: "dist",
  plugins: {
    StatusBar: {
      style: "DARK",
      backgroundColor: "#1d39c4",
      overlaysWebView: false,
    },
  },
};

export default config;
