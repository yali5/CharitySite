import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import fs from "node:fs";
import path from "node:path";

export default defineConfig({
  base: "/",

  server: {
    open: true,
    configureServer(server) {
      server.middlewares.use("/404.html", (req, res, next) => {
        try {
          const filePath = path.join(process.cwd(), "404.html"); // ROOT FILE (not public)
          const html = fs.readFileSync(filePath, "utf-8");
          res.statusCode = 200;
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          res.end(html);
        } catch (e) {
          next(e);
        }
      });
    },
  },

  build: {
    outDir: "dist",
    emptyOutDir: true,
  },

  plugins: [
    viteStaticCopy({
      targets: [
        { src: "404.html", dest: "" }, // copy root 404.html -> dist/404.html
      ],
    }),
  ],
});
