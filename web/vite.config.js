import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://127.0.0.1:9090",
      "/predict": "http://127.0.0.1:8000",
      "/health": "http://127.0.0.1:9090/api/v1/health",
      "/model-info": "http://127.0.0.1:8000",
    },
  },
});
