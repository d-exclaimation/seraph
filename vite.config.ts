/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "esnext",
    minify: false,
    lib: {
      entry: {
        index: "src/export.ts",
        router: "src/router/export.ts",
      },
      name: "seraph",
      formats: ["es", "cjs"],
      fileName: (format, entryName) => {
        const extension = format === "es" ? ".js" : ".cjs";
        if (entryName === "index") {
          return `export${extension}`;
        }
        return `router/export${extension}`;
      },
    },
    copyPublicDir: false,
  },
  server: {
    port: 3000,
  },
  test: {
    testTimeout: 60_000,
    hookTimeout: 60_000,
  },
});
