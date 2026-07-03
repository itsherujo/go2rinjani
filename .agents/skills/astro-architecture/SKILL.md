---
name: astro-architecture
description: >
  Design and scaffold a senior-grade, production-ready Astro project architecture.
  Use this skill whenever the user asks to set up, plan, scaffold, or structure an
  Astro project — including multi-language sites, SEO & GEO-focused sites, portfolio sites,
  marketing sites, landing pages, or any content-heavy web project built with Astro.
  Also trigger when the user asks "how should I structure my Astro project?", "what
  folders do I need in Astro?", or "help me organise my Astro codebase". This skill
  enforces modular, maintainable, island-aware architecture with Generative Engine
  Optimization (GEO), i18n, dark/light mode, and TypeScript as first-class concerns —
  even if the user only mentions a subset of these. Always use this skill before writing
  any Astro file or folder.
  **Co-trigger:** This skill is ALWAYS triggered together with the `react-to-astro`
  skill when the user pastes React code. In that mode, use Step 3b (Placement Engine)
  to resolve output file paths and Step 3c (Scaffold) to ensure directories exist.
---

# Astro Architecture Skill

You are a senior Astro architect. This skill operates in **two modes**:

1. **Full Architecture Mode** (Steps 1–3, 4–7) — When the user asks to plan, scaffold,
   or structure an Astro project. Produce a complete, opinionated, production-grade
   project structure. Do not produce a minimal starter — produce what a world-class
   team would ship.

2. **Placement Engine Mode** (Steps 3b–3c) — When triggered by the `react-to-astro`
   skill (user pastes React code). Resolve the exact file paths for converted components
   and scaffold any missing directories. Do not regenerate the full tree — only resolve
   placement and fill gaps.

---

## Step 1 — Gather Context First

Before generating any structure, ask (or infer from context) the following:

| Question                                                                  | Why it matters                                               |
| ------------------------------------------------------------------------- | ------------------------------------------------------------ |
| What type of site? (marketing, blog, SaaS landing, portfolio, e-commerce) | Determines pages, layouts, content collections               |
| Does it need multi-language (i18n)?                                       | Adds `i18n.routing` configuration and `src/i18n/` directory  |
| Does it need dark/light mode?                                             | Adds `stores/theme.ts`, `tokens.css`, inline init script     |
| Is there a target audience / country?                                     | Affects GEO schema (LocalBusiness vs Organization vs Person) |
| Are there specific SEO keywords to target?                                | Maps keywords → dedicated pages → H1/URL/schema strategy     |
| Does it use a UI framework? (React, Vue, Svelte, none)                    | Determines island setup                                      |
| Does it need heavy interactivity / 3D / animations?                       | Flags need for island split pattern                          |
| Deployment target? (Netlify, Vercel, Cloudflare)                          | Affects `output` configuration and adapters                  |

If the user's request already answers most of these, proceed. Do not ask redundant questions.

---

## Step 2 — Apply the Core Architecture Rules

These rules are **non-negotiable** regardless of project size.

### Rule 1 — Always split heavy components

Every section that needs JS must follow the split pattern:

```
src/components/hero/
├── Hero.astro           ← static shell, layout, H1, SEO content
├── HeroScene.tsx        ← 3D / GSAP island (client:visible)
└── useHeroAnimation.ts  ← animation logic, no JSX
```

Never put GSAP or Three.js directly in a `.astro` page file.

### Rule 2 — Strict Interactive vs Server Directories

- **Interactive Islands**: Page-specific client UI lives in `src/features/[page]/islands/`. Shared layout islands live in `src/components/shared/`.
- **Server Islands**: All heavy asynchronous un-interactive components (`server:defer`) live in `src/components/server/`.
- **Backend Mutations**: Form components live in `src/components/forms/`, and their logic handlers MUST live in `src/actions/` via the Astro Actions API.

### Rule 3 — Astro 6 Generative Engine Optimization (GEO) over Classic SEO

GEO is mandatory for LLM discovery. Never stop at just JSON-LD Article schemas. Always implement EEAT (Experience, Expertise, Authoritativeness, and Trustworthiness) signals:
- Mandatory `Organization` or `Person` schema to validate the publisher/author entity to the AI.
- Semantic HTML tags (`<cite>`, `<blockquote>`) and reference links for all factual content.
- 1 target keyword → 1 URL → 1 page file → 1 H1 → 1 EEAT Strategy.
- **Strict Data Semantics**: Ensure that comparisons, feature lists, and specifications are ALWAYS formatted as `<table>` or `<dl>` (Description Lists), never as styled flexbox divs. LLMs extract data perfectly from tables but struggle with CSS layouts.
- **Heading Hierarchy**: Enforce strict heading continuity (H1 -> H2 -> H3). Never skip levels, as this confuses LLM document parsers.

### Rule 4 — True Configuration with Astro 6 `astro:env`

Never use manual `ImportMetaEnv` hacks that leak secrets. Always use the Astro 6 `astro:env` API inside `astro.config.mjs` to define strict schemas (e.g., `envField.string({ access: "secret" })`) for secure runtime validation.

### Rule 5 — Design tokens over magic values

All colours, spacing, and typography live in `src/styles/tokens.css` as CSS custom
properties. Never use raw hex values or arbitrary Tailwind values in components.

### Rule 6 — Content Collections (Astro 6 Live Content & Loaders)

Any repeating content (blog posts, FAQs, services) must use the Content Layer API (`astro/loaders` like `glob()` and `file()`) with a Zod schema (`import { z } from "astro/zod"`).
For data that needs real-time LLM parsing via APIs, always use `defineLiveCollection()` in `src/live.config.ts`.

### Rule 7 — Route Caching for SSR Performance (Astro 6.0+)

For server-rendered pages, configure a cache provider (e.g., `memoryCache()`) and use `Astro.cache.set()` per-page to cache responses with web-standard semantics:

```astro
---
Astro.cache.set({
  maxAge: 120,    // Cache for 2 minutes
  swr: 60,        // Serve stale for 1 minute while revalidating
  tags: ['home'], // Tag for targeted invalidation
});
---
```

Route caching integrates with Live Content Collections — when a content entry changes, cached pages that depend on it are invalidated automatically via `Astro.cache.set(entry)`.

### Rule 8 — SVG Safety (Astro 6.3+)

SVG rasterization through `<Image>` is **disabled by default** since Astro 6.3 because SVGs can contain embedded scripts. Never pass untrusted SVG sources through the image optimization pipeline. Import SVGs as components instead. Only enable `image.dangerouslyProcessSVG: true` if all SVG sources are fully trusted.

For build-time SVG optimization, use `experimental.svgOptimizer: svgoOptimizer()` to automatically optimize imported SVG components.

### Rule 9 — Advanced Routing (Astro 6.3+)

For complex applications requiring custom request pipelines (auth, rate limiting, logging, proxying), use Astro 6.3 Advanced Routing. Export a fetch handler from `src/app.ts` using composable Astro handlers:

```ts
// src/app.ts
import { Hono } from "hono";
import { logger } from "hono/logger";
import { actions, middleware, pages, i18n } from "astro/hono";

const app = new Hono();
app.use(logger());
app.use(actions());
app.use(middleware());
app.use(pages());
app.use(i18n());

export default app;
```

Available handlers: `astro`, `trailingSlash`, `redirects`, `sessions`, `actions`, `middleware`, `pages`, `cache`, `i18n` — exported from both `astro/fetch` and `astro/hono`.

### Rule 10 — Structured Logging for AI Agents (Astro 6.2+)

Enable JSON structured logging via `experimental.logger: logHandlers.json()` or the CLI flag `--experimentalJson`. This produces machine-readable output critical for AI agent workflows and CI pipelines.

---

## Step 3 — Generate the Structure

Use the canonical folder structure below as your base. **Adapt it** — add or remove
sections based on the project type determined in Step 1. Always annotate each key
entry with a `←` comment explaining its purpose.

### Canonical Structure

```
<project-name>/
│
├── public/
│   ├── favicon.svg
│   ├── robots.txt                            ← static fallback
│   ├── _headers                              ← security headers (Netlify/Cloudflare)
│   └── assets/
│       ├── 3d/                               ← .glb / .gltf models
│       └── og/                               ← Open Graph images (scripts/gen-og.ts)
│
├── src/
│   │
│   ├── actions/                              ← ⚡ Astro Actions (Backend form handlers)
│   │   ├── index.ts                          ← REQUIRED: exports `export const server = { ... }`
│   │   └── user.ts                           ← specific action logic imported into index.ts
│   │
│   ├── app.ts                                ← 🔀 Advanced Routing entry (Astro 6.3, optional)
│   ├── env.d.ts                              ← App.Locals types ONLY (vars move to astro.config.mjs)
│   ├── middleware.ts                         ← Security headers handler (i18n handled by Astro plugin)
│   │
│   ├── pages/                                ← file-based routing
│   │   ├── index.astro                       ← redirects via config fallback/middleware
│   │   ├── 404.astro
│   │   ├── robots.txt.ts                     
│   │   ├── og/[slug].png.ts                  ← OG image generation (Satori + getFontFileURL)
│   │   ├── en/                               ← primary language
│   │   │   ├── index.astro
│   │   │   ├── about.astro
│   │   │   └── blog/
│   │   └── [lang]/                           ← additional languages
│   │       └── index.astro
│   │
│   ├── content.config.ts                     ← Zod schemas (astro/zod) + loaders
│   ├── live.config.ts                        ← Astro 6 Live Content Collections
│   │
│   ├── content/                              ← Content Collections data
│   │
│   ├── features/                             ← 🚀 Page/Domain specific logic
│   │   └── home/
│   │       ├── components/                   ← Page-specific static sections (e.g. Hero.astro)
│   │       ├── islands/                      ← 🏝️ Page-specific interactive client UI (e.g. HeroScene.tsx)
│   │       └── hooks/                        ← Page-specific logic (e.g. useHeroAnimation.ts)
│   │
│   ├── components/                           ← 🧩 Purely shared/global UI
│   │   │
│   │   ├── seo/                              ← SEO & GEO Engine
│   │   │   ├── SEOHead.astro                 ← meta, canonical, hreflang
│   │   │   ├── SchemaOrg.astro               ← JSON-LD dispatcher
│   │   │   ├── schemas/
│   │   │   │   ├── OrganizationSchema.astro  ← EEAT Trust Signal (GEO)
│   │   │   │   ├── PersonSchema.astro        ← EEAT Author Authority (GEO)
│   │   │   │   ├── FAQSchema.astro           ← Q&A structure for LLM parsing
│   │   │   │   └── ArticleSchema.astro       
│   │   │   └── Citations.astro               ← Render blockquotes with <cite>
│   │   │
│   │   ├── server/                           ← 🟣 Server Islands
│   │   │   ├── ProductRecs.astro             ← Pure server fetch component (server:defer)
│   │   │   └── RelatedPosts.astro
│   │   │
│   │   ├── forms/                            ← 🟢 UI Forms (Astro Actions logic goes to /actions)
│   │   │   ├── WaitlistForm.astro            
│   │   │   └── ContactForm.astro             
│   │   │
│   │   ├── layout/                           ← Navigation, Footers
│   │   ├── ui/                               ← Dumb reusable atoms (Button, Card, Icon)
│   │   └── shared/                           ← 🏝️ layout-wide islands (ThemeToggle, LangSwitcher)
│   │
│   ├── layouts/
│   │   ├── BaseLayout.astro                  ← global CSS, SEOHead, theme script
│   │   └── PageLayout.astro                  
│   │
│   ├── i18n/
│   │   ├── config.ts                         ← SUPPORTED_LANGS, DEFAULT_LANG
│   │   ├── utils.ts                          
│   │   └── locales/                          ← Translations dicts
│   │
│   ├── stores/                               ← nanostores (cross-island state)
│   │
│   ├── styles/                               ← tokens.css, global.css, typography.css
│   │
│   ├── lib/                                  ← API clients, external SDKs
│   └── utils/                                ← pure helper functions, string logic
│
├── tests/
├── scripts/
├── astro.config.mjs                          ← CRITICAL: Env schemas, Fonts, i18n
├── tailwind.config.mjs
├── tsconfig.json
└── package.json
```

---

## Step 3b — Component Placement Engine

> **When to use:** Triggered automatically when `react-to-astro` converts
> a component to resolve **where to place** the output files.

### Placement Rules

| Classification | Output Files | Placement Path |
|---|---|---|
| 🟢 STATIC (zero JS) | `[Name].astro` | `src/components/sections/[Name].astro` |
| 🟣 SERVER ISLAND | `[Name].astro` | `src/components/server/[Name].astro` |
| 🟢 STATIC + ⚡ ASTRO ACTIONS | `[FormName].astro` + `[action].ts` | `src/components/forms/[FormName].astro` + `src/actions/[action].ts` |
| 🟡 INTERACTIVE (UI State) | `[Name].astro` + `[Name]Island.tsx` | `src/components/[name]/[Name].astro` + `src/components/[name]/[Name]Island.tsx` |
| 🟠 ANIMATION (GSAP/motion) | `[Name].astro` + `[Name]Island.tsx` + `use[Name]Animation.ts` | `src/components/[name]/` |
| 🔴 3D/CANVAS (Three.js/R3F) | `[Name].astro` + `[Name]Scene.tsx` + lazy wrapper | `src/components/[name]/[Name].astro` + `src/components/islands/[Name]Scene.tsx` |
| 🔵 LOGIC-ONLY (hook/util) | `.ts` file | See sub-rules below |

### Placement Overrides

| Condition | Override |
|---|---|
| Component is a **layout structural element** | → `src/components/layout/` |
| Component is a **dumb UI atom** (button, card) | → `src/components/ui/` |
| Component is an **SEO/GEO element** (schema) | → `src/components/seo/` |

---

## Step 3c — Project Scan & Scaffold

> **When to use:** Before placing files (Step 3b), verify canonical structure. Scaffold missing directories.

### Scan Checklist

```
  □ src/features/            ← for page/domain specific components & islands
  □ src/components/server/   ← for 🟣 SERVER ISLANDS
  □ src/components/forms/    ← for UI forms 
  □ src/actions/             ← for ⚡ ASTRO ACTIONS logic (must contain index.ts)
  □ src/components/shared/   ← for layout islands
  □ src/components/layout/   
  □ src/components/ui/       
  □ src/layouts/             
  □ src/stores/              
  □ src/styles/              
```

---

## Step 4 — Generate Key Implementation Files

Always output the following files as code blocks after the structure.

### 4a. middleware.ts (Simplified)

```ts
import { defineMiddleware, sequence } from "astro:middleware";

// i18n routing is handled by Astro 6 config `i18n.routing` fallback rules.
const securityMiddleware = defineMiddleware(async (_context, next) => {
  const response = await next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return response;
});

export const onRequest = sequence(securityMiddleware);
```

### 4b. astro.config.mjs (Includes Env, i18n, Performance & Astro 6.3 features)

```js
import { defineConfig, fontProviders, envField, memoryCache, svgoOptimizer, logHandlers } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import partytown from "@astrojs/partytown";

export default defineConfig({
  site: "https://yourdomain.com",
  integrations: [
    tailwind(), 
    react(), 
    sitemap(),
    partytown({
      // Adds dataLayer config for GTM/Analytics offloading
      config: { forward: ["dataLayer.push"] },
    })
  ],
  prefetch: true, // Enables instant navigation for data-astro-prefetch links
  compressHTML: "jsx", // Consistent whitespace handling across .astro and .tsx (Astro 6.2)
  image: {
    service: {
      config: {
        jpeg: { mozjpeg: true },
        webp: { effort: 6, alphaQuality: 80 },
        avif: { effort: 4, chromaSubsampling: "4:2:0" },
        png: { compressionLevel: 9 },
      },
    },
    // Configure allowed remote image sources — Astro 6.3 follows up to 10 redirects
    // and validates every URL in the redirect chain against this allowlist.
    remotePatterns: [{ protocol: "https" }], // Restrict to trusted HTTPS hosts
    // dangerouslyProcessSVG: false, // SVG rasterization disabled by default (6.3)
  },
  experimental: {
    rustCompiler: true,               // Faster builds via Rust compiler (6.0+)
    queuedRendering: { enabled: true }, // ~2x faster rendering (6.0+)
    cache: { provider: memoryCache() }, // Route caching — use Astro.cache.set() per-page (6.0+)
    svgOptimizer: svgoOptimizer(),      // Build-time SVG optimization (6.2+)
    logger: logHandlers.json(),         // Structured JSON logging for AI agents (6.2+)
  },
  env: {
    schema: {
      API_KEY: envField.string({ context: "server", access: "secret" }),
      PUBLIC_URL: envField.string({ context: "client", access: "public" })
    }
  },
  markdown: {
    // SmartyPants locale-specific typography (Astro 6.1) — customize for non-English sites
    smartypants: {
      dashes: "oldschool",      // em-dash and en-dash handling
      // openingQuotes: { double: "«", single: "<" },  // e.g. French guillemets
      // closingQuotes: { double: "»", single: ">" },
    },
  },
  i18n: {
    defaultLocale: "en",
    locales: ["en", "zh"],
    routing: {
      prefixDefaultLocale: true,
      fallbackType: "redirect"
    },
  },
  fonts: [
    { name: "YourFont", cssVariable: "--font-body", provider: fontProviders.fontsource() }
  ],
  security: { csp: true },
  server: { allowedHosts: [] }, // Restrict hostnames for preview behind reverse proxies (6.2)
  output: "server", // Required for Server Islands & Actions rendering
});
```

### 4c. src/actions/index.ts (Astro Actions Core)

```ts
import { defineAction } from 'astro:actions';
// Use explicit zod imports from astro
import { z } from 'astro/zod';
import { userActions } from './user';

export const server = {
  user: userActions,
  contact: defineAction({
    input: z.object({ message: z.string() }),
    handler: async (input) => {
      // Execute backend logic safely
      return { success: true, message: "Received!" };
    }
  })
};
```

### 4d. src/pages/og/[slug].png.ts (OG Image Generation — Astro 6.2+)

```ts
import type { APIRoute } from "astro";
import { fontData, experimental_getFontFileURL } from "astro:assets";
import satori from "satori";
import { html } from "satori-html";
import sharp from "sharp";

export const GET: APIRoute = async (context) => {
  const { slug } = context.params;
  const fontPath = fontData["--font-body"][0]?.src[0]?.url;
  if (!fontPath) throw new Error("Cannot find font path for OG image.");

  const url = experimental_getFontFileURL(fontPath, context.url);
  const data = await fetch(url).then((res) => res.arrayBuffer());

  const svg = await satori(
    html`<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;background:linear-gradient(135deg,#1a1a2e,#16213e);color:white;font-size:48px;padding:40px;">${slug}</div>`,
    {
      width: 1200, height: 630,
      fonts: [{ name: "Body", data, weight: 400, style: "normal" }],
    }
  );

  const png = await sharp(Buffer.from(svg)).resize(1200, 630).png().toBuffer();
  return new Response(new Uint8Array(png), {
    headers: { "Content-Type": "image/png" },
  });
};
```

### 4e. src/app.ts (Advanced Routing — Astro 6.3, optional)

Only create when the project needs custom request pipeline logic (auth, rate limiting, logging, proxying):

```ts
import { Hono } from "hono";
import { logger } from "hono/logger";
import { actions, middleware, pages, i18n, cache } from "astro/hono";

const app = new Hono();

// Custom middleware runs first
app.use(logger());
app.use(async (c, next) => {
  // Example: auth guard
  if (new URL(c.req.url).pathname.startsWith("/admin")) {
    return c.redirect("/login");
  }
  return next();
});

// Astro handlers in the order you choose
app.use(cache());       // Route caching
app.use(actions());     // Astro Actions
app.use(middleware());  // Astro middleware
app.use(pages());       // Page rendering
app.use(i18n());        // i18n routing

export default app;
```

---

## Step 6 — Apply the GEO & SEO Checklist

For every project, GEO and EEAT are mandatory for ranking inside Generative Engines.

```
Page level
  □ 1 H1 per page containing the exact target keyword
  □ Semantic tag enforcement (<cite>, <blockquote>) for external facts
  □ Title tag: "[Keyword] | [Brand]"
  □ Canonical URL and hreflang tags
  □ `x-default` hreflang link pointing to default locale page (SEO best practice for all i18n sites)
  □ Third-party scripts (Analytics/Ads) MUST use `type="text/partytown"`
  □ All interactive elements must have clear text or `aria-label`
  □ Data comparisons/features use `<table>` or `<dl>` instead of `<div>`
  □ OG images generated at build time via `experimental_getFontFileURL()` + Satori
  □ SSR pages use `Astro.cache.set({ maxAge, swr, tags })` for route caching
  □ CJK text uses `text-autospace` CSS property for legible spacing (applies to all CJK content sites)

Schema (JSON-LD EEAT & GEO)
  □ Person/Organization Schema (Provides "Authoritativeness" to AI models)
  □ Article Schema heavily linked to the "publisher"
  □ FAQPage (Critical for LLM structured Q&A generation)
  □ LocalBusiness or Service Schema
```

---

## Non-Negotiable Quality Bars

| Concern    | Standard                                                              |
| ---------- | --------------------------------------------------------------------- |
| Env Vars   | Always validated by `astro:env` schemas in `astro.config.mjs`         |
| Fonts      | Always preloaded through Astro 6 Built-in Fonts API                   |
| State      | Nanostores for cross-island; Astro Actions for data mutation          |
| i18n       | All routing handled natively by Astro Config; translations in `ui.ts` |
| Backend    | Form interactions MUST live inside `src/actions/index.ts`             |
| Runtimes   | Cloudflare deployments MUST use `cloudflare:workers` via Vite 7 API   |
| SVG Safety | SVG rasterization disabled by default (6.3); import SVGs as components |
| Images     | External images require `image.domains` or `image.remotePatterns`     |
| Caching    | SSR pages use `Astro.cache.set()` with tags for auto-invalidation     |
| Routing    | Complex apps use `src/app.ts` Advanced Routing with composable handlers |
| Logging    | AI agent workflows use `experimental.logger: logHandlers.json()`      |
| OG Images  | Generated at build time via `experimental_getFontFileURL()` + Satori  |
| Whitespace | `compressHTML: "jsx"` for consistent handling across .astro and .tsx  |
| Compiler   | Enable `experimental.rustCompiler: true` for faster builds            |
