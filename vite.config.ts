import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { fileURLToPath } from "url";
import { resolve } from "path";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/Cloner/index.ts"), // Updated entry point
      name: "Cloner",
      fileName: (format) => `cloner.${format}.js`,
      formats: ["es", "umd"],
    },
    rollupOptions: {
      external: ["@babylonjs/core"], // Exclude from bundle
      output: {},
    },
  },
  plugins: [
    dts({
      entryRoot: "src/Cloner",
      outDir: "dist",
      include: ["src/Cloner/**/*.ts"],
    }),
  ],
});
