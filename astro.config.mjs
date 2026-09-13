// @ts-check
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://nicolaspaixao.com.br",
  trailingSlash: "always",
  i18n: {
    locales: ["pt", "en"],
    defaultLocale: "pt",
    routing: { prefixDefaultLocale: false },
  },
});
