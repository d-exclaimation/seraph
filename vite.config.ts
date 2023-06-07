/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "esnext",
    minify: false,
    lib: {
      entry: "src/export.ts",
      name: "index",
      formats: ["es", "cjs"],
      fileName: "export",
    },
  },
  server: {
    port: 3000,
  },
  test: {
    testTimeout: 60_000,
    hookTimeout: 60_000,
  },
});
