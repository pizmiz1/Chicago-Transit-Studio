import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/cta/alerts": {
        target: "https://lapi.transitchicago.com",
        changeOrigin: true,
        rewrite: (path) => {
          const url = new URL(path, "http://localhost");
          url.pathname = "/api/1.0/alerts.aspx";
          url.searchParams.set("outputType", "JSON");
          return `${url.pathname}${url.search}`;
        },
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "/src/styles/variables" as *; @use "/src/styles/mixins" as *;`,
      },
    },
  },
});
