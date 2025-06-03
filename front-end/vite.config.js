import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    allowedHosts: [
      "c5a1-14-232-229-113.ngrok-free.app",
      "e878-14-232-229-113.ngrok-free.app",
    ],
    proxy: {
      "/api": {
        target: "https://e92c-171-224-178-46.ngrok-free.app",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
