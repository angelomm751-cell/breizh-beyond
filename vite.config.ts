// @lovable.dev/vite-tanstack-config already provides the required plugins.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    // This project is deployed at the GitHub Pages subpath /breizh-beyond/.
    // Keep the base explicit so CSS, JS and assets load correctly in production.
    base: "/breizh-beyond/",
  },
  tanstackStart: {
    server: {
      entry: "server",
      preset: "static",
    },
    prerender: {
      enabled: true,
      crawlLinks: true,
    },
  },
});
