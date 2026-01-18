import { defineConfig } from "vite";

export default defineConfig({
  // this tells Vite: serve static files from /public
  publicDir: "public",

  server: {
    open: true
  },

  build: {
    outDir: "dist",
    emptyOutDir: true
  }
});
