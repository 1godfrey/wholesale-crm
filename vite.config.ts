import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src") // Add this
    }
  },
  root: path.resolve(__dirname, "./"), // Fix root directory
  build: {
    outDir: path.resolve(__dirname, "dist"),
  },
  server: {
    port: 5173
  }
});