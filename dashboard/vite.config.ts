import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    base: "./",
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
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
    define: {
      "process.env": {},
      "import.meta.env": env,
    },
  };
});
