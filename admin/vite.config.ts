import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/admin/",
  publicDir: "../catalogo/public",
  plugins: [react()],
  server: { fs: { allow: [".."] } },
});
