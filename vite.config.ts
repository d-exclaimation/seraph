/// <reference types="vitest" />
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  if (env.PLAYGROUND) {
    return {
      build: {
        outDir: "dist-playground",
      },
      plugins: [tsconfigPaths()],
    };
  }

  return {
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
    plugins: [tsconfigPaths()],
  };
});
