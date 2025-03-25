/** @type {import('vite').UserConfig} */
import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import Components from "unplugin-vue-components/vite";
import dynamicImport from "vite-plugin-dynamic-import";
import cdn from "vite-plugin-cdn-import";
import { VitePWA } from "vite-plugin-pwa";
import { readFileSync } from "fs";
import { resolve } from "path";
import Markdown from "vite-plugin-md";
import rawPlugin from "vite-raw-plugin";

// 读取 package.json 文件
const pkg = JSON.parse(
  readFileSync(resolve(__dirname, "package.json"), "utf-8"),
);

const BASE_DOMAIN = process.env.VITE_BASE_DOMAIN || "https://ai-proxy.tomz.io";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/], // 支持 .vue 和 .md 文件
    }),
    Markdown(),
    rawPlugin({
      fileRegex: /\.md$/,
    }),
    dynamicImport({
      loose: true, // 更接近 Webpack 的行为
    }),
    cdn({
      modules: ["dayjs", "axios", "lodash"],
    }),
    tailwindcss(),
    Components({
      resolvers: [IconsResolver()],
    }),
    Icons(),
    VitePWA({
      mode: "production",
      // registerType: "autoUpdate", // 自动更新 Service Worker 并刷新页面
      registerType: "prompt",
      injectRegister: "auto",
      // strategies: "injectManifest",
      includeAssets: [
        "favicon.svg",
        "robots.txt",
        "apple-touch-icon.png",
        "**/*.png",
        "**/*.jpg",
        "**/*.jpeg",
        "**/*.svg",
        "**/*.woff2",
        "**/*.woff",
        "**/*.ttf",
        "**/*.otf",
      ],
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,jpg,gif,svg,woff,ttf,otf,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /\.(png|jpg|jpeg|svg|gif|woff|ttf|otf|woff2)$/,
            handler: "CacheFirst", // 优先从缓存中查找响应
          },
          {
            urlPattern: /\.(js|css|html)$/,
            handler: "StaleWhileRevalidate", // 先返回缓存，后台更新
          },
        ],
        // skipWaiting: true, // 跳过等待，直接激活新版本
        // clientsClaim: true, // 激活后接管页面
      },
      manifest: {
        name: "UI Chat",
        short_name: "UIChat",
        description: "渐进式的客户端聊天智能体",
        theme_color: "#2f54eb", //PWA 的主题颜色，用于地址栏、通知栏等
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",

        icons: [
          {
            src: "/logoIcon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/logoIcon.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/logoIcon.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/logoIcon.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      devOptions: {
        enabled: true, // 开发环境中启用 PWA 功能
        type: "classic",
        // type: "module",
        navigateFallback: "index.html",
      },
    }),
  ],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __APP_NAME__: JSON.stringify(pkg.name),
    __APP_DESCRIPTION__: JSON.stringify(pkg.description),
    __APP_BASE_DOMAIN__: JSON.stringify(BASE_DOMAIN),
  },
  server: {
    allowedHosts: ["tavern.tomz.io"],
    port: 8461,
  },
  resolve: {
    alias: {
      "@": path.resolve("./src"),
      "#": path.resolve("./types"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: "assets/[name].[hash].js",
        chunkFileNames: "assets/[name].[hash].js",
        assetFileNames: "assets/[name].[hash].[ext]",
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString();
          }
        },
      },
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },

  test: {
    globals: true,
    environment: "jsdom",
    reporters: ["html"],
    outputFile: "tests/unit.html",
  },
});
