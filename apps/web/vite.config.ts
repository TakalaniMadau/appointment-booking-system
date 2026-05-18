import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/capitec-api": {
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/capitec-api/, "/website/api"),
        target: "https://admin.goreview.co.za",
      },
    },
  },
});
