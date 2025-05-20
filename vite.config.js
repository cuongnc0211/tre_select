import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/treselect.js",
      name: "TreSelect",
      fileName: (format) => `treselect.${format}.js`,
    },
    rollupOptions: {
      output: {
        exports: "named"
      }
    }
  }
});
