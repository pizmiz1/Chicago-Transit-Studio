import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/cta/routes": {
        target: "https://lapi.transitchicago.com",
        changeOrigin: true,
        rewrite: () => "/api/1.0/routes.aspx?outputType=JSON",
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "/src/styles/variables" as *;`,
      },
    },
  },
});
