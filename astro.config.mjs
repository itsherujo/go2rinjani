// @ts-check
import { defineConfig, fontProviders, envField } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { isTourAliasPath } from "./src/utils/tour-routes.ts";

// https://astro.build/config
export default defineConfig({
  site: "https://go2rinjani.com",
  output: 'server',
  adapter: cloudflare(),
  integrations: [
    react(),
    mdx(),
    sitemap({
      filter: (page) => {
        const path = new URL(page).pathname;
        const isLegalRedirect = /\/legal\/?$/.test(path) || /\/[a-z]{2}\/legal\/?$/.test(path);
        return !isTourAliasPath(path) && !isLegalRedirect;
      },
    }),
  ],
  i18n: {
    defaultLocale: "en",
    locales: ["en", "id", "zh", "de", "fr", "es"],
    routing: {
      prefixDefaultLocale: false,
    }
  },

  fonts: [
    {
      name: "Inter",
      cssVariable: "--font-inter",
      provider: fontProviders.google(),
      weights: [400, 500, 600, 700, 900],
    },
  ],

  env: {
    schema: {
      RESEND_API_KEY: envField.string({ context: "server", access: "secret" }),
      NOTIFICATION_EMAIL: envField.string({
        context: "server",
        access: "secret",
        default: "jofrzl21@gmail.com",
      }),
    },
  },

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ['settings', 'astro:zod', 'astro:schema'],
    },
    resolve: {
      alias: import.meta.env.PROD ? {
        'react-dom/server': 'react-dom/server.edge',
      } : {
        'react-dom/server': 'react-dom/server.edge',
      },
    },
  }
});