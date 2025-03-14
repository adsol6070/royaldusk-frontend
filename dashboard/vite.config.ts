import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./",
  server: {
    host: "0.0.0.0",
    port: 5173,
    allowedHosts: ["royaldusk.com", "www.royaldusk.com"],
  },
  preview: {
    host: "0.0.0.0",
    port: 4173,
    allowedHosts: ["royaldusk.com", "www.royaldusk.com"],
  },
});
