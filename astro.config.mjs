// @ts-check

import vue from "@astrojs/vue";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://revosurge-org.github.io",
  base: "/revo-docs/",
  // Enable Vue to support Vue components.
  integrations: [vue()],
});
