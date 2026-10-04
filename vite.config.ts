// @lovable.dev/vite-tanstack-config already provides the required plugins.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    // GitHub Pages needs the repository subpath; Lovable preview must keep root-relative assets.
    base: process.env.GITHUB_ACTIONS === "true" ? "/breizh-beyond/" : "/",
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
