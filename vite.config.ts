import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "esnext",
    minify: false,
    lib: {
      entry: "src/seraph.ts",
      name: "index",
      formats: ["es", "cjs"],
      fileName: "seraph",
    },
  },
  server: {
    port: 3000,
  },
});
