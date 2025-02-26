/** @type {import('vite').UserConfig} */
import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import Components from "unplugin-vue-components/vite";
import legacy from "@vitejs/plugin-legacy";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { readFileSync } from "fs";
import { resolve } from "path";

// 读取 package.json 文件
const pkg = JSON.parse(
  readFileSync(resolve(__dirname, "package.json"), "utf-8"),
);

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    Components({
      resolvers: [IconsResolver()],
    }),
    Icons(),
    legacy({
      targets: ["defaults", "not IE 11"],
    }),
    nodeResolve(),
    commonjs(),
  ],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __APP_NAME__: JSON.stringify(pkg.name),
    __APP_DESCRIPTION__: JSON.stringify(pkg.description),
  },
  server: {
    port: 8461,
  },
  resolve: {
    alias: {
      "@": path.resolve("./src"),
      "#": path.resolve("./types"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    reporters: ["html"],
    outputFile: "tests/unit.html",
  },
});
