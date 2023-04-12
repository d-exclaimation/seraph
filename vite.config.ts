import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "esnext",
    minify: false,
    lib: {
      entry: "src/seraph.ts",
      name: "index",
      formats: ["es", "cjs"],
    },
  },
  server: {
    port: 3000,
  },
});
