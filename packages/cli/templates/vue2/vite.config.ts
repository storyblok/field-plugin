import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue2";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import { name } from "./package.json";

console.log("💡 Field-Type name:", name);
console.log("");

// https://vitejs.dev/config/
export default defineConfig({
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
  plugins: [vue(), cssInjectedByJsPlugin()],
  // @ts-expect-error this is coming from vitest
  test: {
    globals: true,
    environment: "jsdom",
  },
});
