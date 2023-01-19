import { resolve } from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue2";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import { name } from "./package.json";

console.log("💡 Field-Type name:", process.env.DEV_OVERRIDE_NAME ?? name);
console.log("");

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __DEV_OVERRIDE_NAME__: JSON.stringify(process.env.DEV_OVERRIDE_NAME),
    __DEV_PLAYGROUND__: process.env.DEV_PLAYGROUND === "true",
  },
  build: {
    // minify: false,
    rollupOptions: {
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`,
      },
    },
  },
  plugins: [
    vue(),
    cssInjectedByJsPlugin(),
    process.env.NODE_ENV === "production" && excludePlayground(),
  ],
  // @ts-expect-error this is coming from vitest
  test: {
    globals: true,
    environment: "jsdom",
    alias: [
      {
        find: /^@storyblok\/field-type-common$/,
        replacement: resolve(__dirname, "../common/src/index.ts"),
      },
    ],
  },
});

function excludePlayground() {
  return {
    name: "exclude-playground",
    load(id: string) {
      if (id.includes("playground/")) {
        return "";
      }
      return null;
    },
  };
}
