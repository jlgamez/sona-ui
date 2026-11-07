import { defineConfig } from "electron-vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  main: {
    build: {
      rollupOptions: {
        input: path.resolve(__dirname, "electron/main.ts"),
        output: { entryFileNames: "index.js" },
      },
    },
  },
  preload: {
    build: {
      rollupOptions: {
        input: path.resolve(__dirname, "electron/preload.ts"),
        // Sandboxed preload scripts must be CommonJS.
        output: { format: "cjs", entryFileNames: "index.cjs" },
      },
    },
  },
  renderer: {
    root: ".",
    build: {
      rollupOptions: { input: path.resolve(__dirname, "index.html") },
    },
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: { "@": path.resolve(__dirname, "./src") },
    },
  },
});
