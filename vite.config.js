import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
      },
    },
    hmr: {
      host: "localhost",
      port: 3000,
    },
  },
  assetsInclude: ["**/*.woff", "**/*.woff2", "**/*.mp3"],
  publicDir: "public",
});
