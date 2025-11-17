import { defineConfig } from "vite";
import { fileURLToPath } from "url";
import { resolve } from "path";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  root: ".",
  build: {
    outDir: "dist-demo",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
      },
    },
  },
  base: "./",
});

