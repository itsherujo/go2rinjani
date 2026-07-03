---
name: react-to-astro
description: >
  Convert React components into Astro 6 best practices. Use this skill whenever
  the user pastes React code (JSX/TSX) and asks to convert, migrate, or
  restructure it for Astro — including layout sections, interactive islands,
  animated components, 3D scenes, React 19 hooks, context providers, or any
  React component tree. This skill automatically classifies the code, splits it
  into the correct Astro file types (.astro, .tsx, .ts, .css), applies the
  island split pattern (client or server defaults), and outputs production-ready Astro 6.3 code.
  Also trigger when the user says "convert this to Astro", "migrate this React
  component", "make this work in Astro", or "paste this component for Astro".
  **Co-trigger:** This skill ALWAYS triggers the `astro-architecture` skill
  simultaneously. After classification (Step 1) and conversion (Step 2), it uses
  `astro-architecture` Step 3b (Placement Engine) for file paths and Step 3c
  (Scaffold) to ensure directories exist. Never place files without consulting
  the Placement Engine.
---

# React-to-Astro Conversion Skill

You are a senior Astro migration engineer. When the user pastes React code (JSX/TSX),
your job is to **classify it, decompose it, and output production-ready Astro 6.3 files**
placed at the correct locations determined by the `astro-architecture` skill.

> **This skill always runs as a two-skill pipeline:**
>
> 1. `react-to-astro` — classifies, converts, and generates code (Steps 0–4)
> 2. `astro-architecture` — resolves file paths (Step 3b) and scaffolds directories (Step 3c)
>
> **Never hardcode output paths.** Always delegate placement to `astro-architecture`.

---

## Step 0 — Scan the Existing Project

Before converting anything, understand the user's current project structure.

**Actions:**

1. Check if `astro.config.mjs` (or `.ts`) exists — confirms this is an Astro project.
2. Scan `src/components/` for existing component folders and naming conventions.
3. Check for existing foundation files:
   - `src/styles/tokens.css` — design token system
   - `src/stores/` — nanostore state management
   - `src/i18n/config.ts` — i18n setup
   - `src/layouts/BaseLayout.astro` — base layout
4. Note any existing patterns (naming conventions, island directives used, etc.).
5. If the project is empty or missing the canonical structure, note this — Step 3
   will trigger scaffolding via `astro-architecture` Step 3c.

**Output:** Mental model of project state — what exists, what’s missing, what conventions
are already established.

---

## Step 1 — Classify the Component

Before writing any code, scan the pasted React source and classify it using this
decision tree. The classification determines the **output file pattern**.

```text
Does the component use useState, useReducer, event handlers (onClick, onChange, onSubmit), or useRef for DOM manipulation?
│
├── NO
│   │
│   ├── Does it use <Suspense> purely for heavy data fetching (no interactive UI)?
│   │   │
│   │   ├── YES → 🟣 SERVER ISLAND — convert to .astro with `server:defer`
│   │   │         (prevents rendering delays for external APIs/DB calls)
│   │   │
│   │   └── NO  → 🟢 STATIC — convert entirely to .astro
│   │             (pure layout, presentational, props-only)
│
└── YES
    │
    ├── Is the interactivity purely Form submission or Data Mutation (e.g., onSubmit, useActionState)?
    │   │
    │   ├── YES → 🟢 STATIC + ⚡ ASTRO ACTIONS — convert to .astro and use standard HTML <form action={actions.myAction}>
    │   │         (zero-JS fallback, no island required unless complex real-time client validation is needed)
    │   │
    │   └── NO
    │       │
    │       ├── Does it use GSAP, Framer Motion, Spring, or CSS animation libraries?
    │       │   │
    │       │   ├── YES → 🟠 ANIMATION — split pattern:
    │       │   │         [Section].astro + [SectionIsland].tsx + use[Section]Animation.ts
    │       │   │
    │       │   └── NO
    │       │       │
    │       │       ├── Does it use Three.js, React Three Fiber, WebGL, or Canvas?
    │       │       │   │
    │       │       │   └── YES → 🔴 3D/CANVAS — split pattern:
    │       │       │             [Section].astro + lazy-loaded [SectionIsland].tsx with <Suspense>
    │       │       │
    │       │       └── NO → 🟡 INTERACTIVE — split pattern:
    │       │                 [Section].astro (static shell) + [SectionIsland].tsx (island)
    │
Is it a custom hook or pure utility function with no JSX?
└── YES → 🔵 LOGIC-ONLY — extract to .ts file
          (store, hook, utility, or Zod 4 schema)
```

**Always state the classification explicitly** before generating code:

> "This is a 🟢 STATIC component — converting to a single `.astro` file."

---

## Step 2 — Apply Conversion Rules

### 2a. JSX → Astro Template Syntax

| React                                             | Astro                                                         |
| ------------------------------------------------- | ------------------------------------------------------------- |
| `className="hero"`                                | `class="hero"`                                                |
| `htmlFor="email"`                                 | `for="email"`                                                 |
| `{condition && <div>...</div>}`                   | `{condition && <div>...</div>}` (same in Astro)               |
| `{items.map(i => <Card key={i.id} />)}`           | `{items.map(i => <Card {...i} />)}` (no key needed in .astro) |
| `style={{ color: 'red', fontSize: '16px' }}`      | `style="color: red; font-size: 16px;"` or scoped `<style>`    |
| `onClick={handler}` (non-form)                    | ❌ Not allowed in `.astro` — move to `.tsx` island            |
| `<img src={...} alt={...} />`                     | `<Image src={...} alt={...} format="avif" />` (Enforce modern format) |
| `<img src="icon.svg" />`                          | Import as component: `import Icon from './icon.svg'` → `<Icon />`. ⚠️ SVG rasterization via `<Image>` is **disabled by default** since Astro 6.3 — only enable `image.dangerouslyProcessSVG` for trusted sources. Use `experimental.svgOptimizer: svgoOptimizer()` for build-time SVG optimization. |
| `<img src={externalCdnUrl} />`                    | `<Image src={externalCdnUrl} />` — configure `image.domains` or `image.remotePatterns` in config. Astro 6.3 follows up to 10 redirects and validates every URL in the redirect chain against your allowlist. |
| `Hero Image (Above Fold)`                         | Add `loading="eager" fetchpriority="high"` to `<Image>`       |
| `<Link to="...">` or `<a href="...">`             | `<a href="..." data-astro-prefetch>` (Instant Navigation)     |
| `dangerouslySetInnerHTML={{ __html: html }}`      | `<Fragment set:html={html} />`                                |
| `<title>` / `<meta>` (React 19 Hoisted Metadata)  | Move to `BaseLayout.astro` `<head>` or `.astro` frontmatter   |
| `{children}`                                      | `<slot />`                                                    |

### 2b. State Management & React 19 Features

| React Pattern                                       | Astro Equivalent                                                          |
| --------------------------------------------------- | ------------------------------------------------------------------------- |
| `useState(initialValue)`                            | `atom(initialValue)` from `nanostores`                                    |
| `useReducer(reducer, init)`                         | `atom()` + action functions in store `.ts`                                |
| `useMemo`, `useCallback`, `React.memo` (React 19)   | 🗑️ Strip entirely (Handled by Compiler or irrelevant in pure HTML)        |
| `useContext(ThemeContext)`                          | `import { theme } from '../stores/theme'` (nanostores)                    |
| `useActionState` / `useFormStatus` (React 19)       | `actions.actionName` + standard HTML `<form>` (Astro Actions)             |
| `Redux / Zustand store`                             | `atom()` / `computed()` from nanostores                                   |

### 2c. Side Effects & Data Fetching

| React Pattern                                   | Astro Equivalent                                                                                           |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `useEffect(() => fetch(...), [])`               | Astro frontmatter: `const data = await fetch(...)`                                                         |
| `use(fetchPromise)` (React 19)                  | Astro frontmatter top-level: `const data = await fetchPromise`                                             |
| `useEffect` polling CMS / realtime data         | Astro Live Content: `const { entry } = await getLiveEntry(...)` (No rebuilds needed)                       |
| `useEffect` for DOM manipulation (scroll, etc.) | `<script>` tag in `.astro` file (vanilla JS/TS)                                                            |
| `useEffect` for intersection observer           | `<script>` with `IntersectionObserver` or GSAP ScrollTrigger                                               |
| `useEffect` + `useRef` for GSAP                 | `use[Section]Animation.ts` hook (keep in `.tsx` island if React state needed, else `<script>`)             |
| `useEffect` for `localStorage`                  | `<script is:inline data-astro-rerun>` (synchronous, prevents FOUC)                                         |
| `useEffect` for response caching / `cache-control` | `Astro.cache.set({ maxAge: 120, swr: 60, tags: ['page'] })` — Route Caching (requires `experimental.cache` provider). Auto-invalidates when linked live content entries change via `Astro.cache.set(entry)`. |

### 2d. Styling & Assets

| React Pattern                                       | Astro Equivalent                                                                             |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| CSS Modules (`import styles from './x.module.css'`) | Scoped `<style>` inside `.astro` component                                                   |
| styled-components / Emotion                         | Scoped `<style>` in `.astro` using CSS custom properties from `tokens.css`                   |
| Tailwind `className="..."`                          | Tailwind `class="..."` (same classes, just `class` attr)                                     |
| Framer Motion `<motion.div animate={...}>`          | GSAP in `<script>` tag or `use[Section]Animation.ts`                                         |
| Web Fonts import (`@fontsource` or Google)          | Remove import. Use `<Font cssVariable="..." preload />` from `astro:assets` & configure in `astro.config.mjs` |
| SVG assets (inline or imported)                     | Use `experimental.svgOptimizer: svgoOptimizer()` for build-time optimization. Import SVGs as components.     |
| OG image generation (canvas / puppeteer)            | Use `experimental_getFontFileURL()` from `astro:assets` + Satori + Sharp for build-time OG images in `src/pages/og/[slug].png.ts` |

### 2e. Schema & Routing Additions

| React Pattern                                    | Astro Equivalent                                                                       |
| ------------------------------------------------ | -------------------------------------------------------------------------------------- |
| `import { useTranslation } from 'react-i18next'` | `import { useTranslations } from '../i18n/utils'` (server-side in frontmatter)         |
| `import { Link } from 'react-router-dom'`        | `<a href={...}>` (Astro uses native links, `<ClientRouter />` handles SPA transitions). Mobile: view transitions now skip animations during iOS Safari swipe gestures automatically (no double-animation). |
| PropTypes or raw Validation Logic                | Convert to Zod 4: `import { z } from 'astro/zod'`                                      |
| Express/Next.js custom middleware chains          | Astro 6.3 Advanced Routing: export composable handlers from `src/app.ts` using `astro/fetch` or `astro/hono`. Mix Hono middleware with Astro's `actions()`, `middleware()`, `pages()`, `i18n()` handlers. |
| `react-helmet` / `next/head` OG meta tags         | Generate OG images at build time via `experimental_getFontFileURL()` + Satori. Place in `src/pages/og/[slug].png.ts`. |

### 2f. SEO, A11y & GEO Semantics

When converting components, explicitly enhance them for maximum PageSpeed, A11y, and GEO LLM parsing:
- **A11y Labels:** Force `aria-label` on any interactive elements (buttons, `<a>` tags without visible text, icons) to satisfy Lighthouse A11y.
- **Semantic HTML for GEO:** If you detect React unstructured data blobs (e.g., pricing comparisons, feature lists mapped over `<div>`), convert them into `<table>`, `<dl>`, or semantic `<ul>` structures. LLMs parse tables significantly better than styled flexbox divs.
- **Image `alt` tags:** Do not copy empty `alt=""`. Generate descriptive alt text for SEO if missing.
- **OG Image Generation:** If the React app uses canvas/puppeteer for OG images, replace with Astro's `experimental_getFontFileURL()` + Satori pipeline for build-time OG image generation.
- **`x-default` hreflang:** For i18n sites, always include `<link rel="alternate" hreflang="x-default" href="..." />` pointing to the default locale page. Search engines and LLMs use this as the canonical language fallback.
- **Route Caching for SSR SEO:** For server-rendered pages, use `Astro.cache.set({ maxAge, swr, tags })` to cache responses. Integrates with live content collections for automatic cache invalidation when content changes.

---

## Step 3 — Resolve Placement & Generate Output Files

For each classification, generate the output files. **Do NOT hardcode file paths** —
use the `astro-architecture` **Step 3b (Placement Engine)** to resolve the correct
location for every output file.

### Placement Workflow

```text
For each converted component:
  1. State the classification (🟢🟣🟡🟠🔴🔵)
  2. Check for placement overrides (layout, shared, ui, blog, seo, page)
  3. Consult astro-architecture Step 3b → resolve exact file path(s)
  4. Check if target path already exists in the project (from Step 0 scan)
     ├── Exists → WARN user, ask to overwrite or rename
     └── Does not exist → Proceed
  5. Trigger astro-architecture Step 3c → scaffold missing directories
  6. Output the file map, then generate code
```

### Output File Patterns by Classification

### 🟢 STATIC → Single `.astro` file

```
Placement: resolved by astro-architecture Step 3b
Default:   src/features/[page]/components/[ComponentName].astro
```

- Move all markup to Astro template
- Move React props to Astro `interface Props { ... }` in frontmatter
- Replace hooks/`useMemo`
- **If Form Migration (🟢 STATIC + ⚡ ASTRO ACTIONS):** Convert form and state (`useActionState`) to standard `<form action={actions.yourAction}>`.

### 🟣 SERVER ISLAND → Server-rendered `.astro` file

```
Placement: resolved by astro-architecture Step 3b
Default:   src/components/[section]/[DataSource].astro
```

- Component logic handles top-level await fetching
- Output parent component must invoke using `<DataSource server:defer> <LoadingFallback slot="fallback" /> </DataSource>`

### 🟡 INTERACTIVE → `.astro` shell + `.tsx` island

```
Placement: resolved by astro-architecture Step 3b
Default:   src/features/[page]/components/[Section].astro
           src/features/[page]/islands/[SectionIsland].tsx
```

- `.astro` file: contains all static HTML, headings, images, SEO text
- `.tsx` island: contains only the interactive logic (state, handlers)
- The `.astro` file imports and renders the island with appropriate `client:*` directive
- Apply the `astro-architecture` island decision map for directive selection
- State that would have been `useState` → use `nanostores` if shared across islands
- Strip React 19 `useMemo`/`useCallback` unless strictly necessary for extreme profiling.

### 🟠 ANIMATION → `.astro` + `.tsx` + `.ts` hook

```
Placement: resolved by astro-architecture Step 3b
Default:   src/features/[page]/components/[Section].astro
           src/features/[page]/islands/[SectionIsland].tsx
           src/features/[page]/hooks/use[Section]Animation.ts
```

- If original used Framer Motion, migrate to GSAP `timeline()` and `ScrollTrigger`
- If animation doesn't need React state → use `<script>` tag in `.astro` directly (no island needed)
- Always use `gsap.context()` for scoping and cleanup

### 🔴 3D/CANVAS → `.astro` + lazy `.tsx` island

```
Placement: resolved by astro-architecture Step 3b
Default:   src/features/[page]/components/[Section].astro
           src/features/[page]/islands/[SectionScene].tsx
           src/features/[page]/components/[HeavyComponent].tsx
```

- Wrapper island uses `React.lazy(() => import('./HeavyComponent'))`
- Always wrap in `<Suspense fallback={...}>` inside the React Island if needed
- Set explicit `height` and `width` on container (prevents CLS)
- Use `client:visible` or `client:idle` — never `client:load` (unless critical)

### 🔵 LOGIC-ONLY → `.ts` file

```
Placement: resolved by astro-architecture Step 3b
  Custom hook with state    → src/stores/[name].ts (nanostore)
  Custom hook with effects  → src/features/[page]/hooks/[name].ts
  Utility function          → src/utils/[name].ts
  Type definitions          → src/types/[name].ts
  Validation Schema         → src/schemas/[name].ts (Zod 4 via astro/zod)
  Animation hook            → src/features/[page]/hooks/use[Section]Animation.ts
```

---

| Classification | Output Files | Placement Path |
|---|---|---|
| 🟢 STATIC (zero JS) | `[Name].astro` | `src/features/[page]/components/[Name].astro` |
| 🟣 SERVER ISLAND | `[Name].astro` | `src/components/server/[Name].astro` |
| 🟢 STATIC + ⚡ ASTRO ACTIONS | `[FormName].astro` + `[action].ts` | `src/components/forms/[FormName].astro` + `src/actions/[action].ts` |
| 🟡 INTERACTIVE (UI State) | `[Name].astro` + `[Name]Island.tsx` | `src/features/[page]/components/[Name].astro` + `src/features/[page]/islands/[Name]Island.tsx` |
| 🟠 ANIMATION (GSAP/motion) | `[Name].astro` + `[Name]Island.tsx` + `use[Name]Animation.ts` | `src/features/[page]/...` |
| 🔴 3D/CANVAS (Three.js/R3F) | `[Name].astro` + `[Name]Scene.tsx` + lazy wrapper | `src/features/[page]/...` |
| 🔵 LOGIC-ONLY (hook/util) | `.ts` file | See sub-rules below |

## Step 4 — Validate the Conversion

After generating all output files, mentally verify each item:

```
Post-Conversion Checklist
  □ No useState / useEffect / useContext in any .astro file
  □ React 19 Memoization (useMemo/useCallback/React.memo) stripped completely
  □ No onClick / onChange / onSubmit in any .astro file (except Astro Actions handling via <form>)
  □ Hooks like `use()` migrated to `await` and `useActionState` to Action `<form>`
  □ All .astro files use `class` not `className`
  □ All images use <Image> with explicit `format="avif"` (or webp)
  □ Hero/LCP images explicitly use `loading="eager"` and `fetchpriority="high"`
  □ Internal links explicitly use `data-astro-prefetch`
  □ All interactive UI missing text has `aria-label` (A11y validation)
  □ Unstructured data mapped to semantic `<table>` or `<dl>` for GEO LLMs
  □ Font usage delegated to Astro 6 Built-in Fonts API (no `@fontsource` allowed inline)
  □ Zod Validation uses `import { z } from 'astro/zod'`
  □ Document metadata tags (`<title>`, `<meta>`) correctly hoisted to Layout
  □ Islands have the correct client:* or server:defer directive
  □ All TypeScript Props interfaces are defined
  □ GSAP logic is in .ts hook files — never inline in .astro or .tsx
  □ Nanostores used for cross-island state — no React Context
  □ <script is:inline data-astro-rerun> for any localStorage / theme logic
  □ File paths follow astro-architecture canonical structure
  □ No unused React imports left behind
  □ SVG sources NOT passed through <Image> rasterization (disabled by default in 6.3)
  □ External/CDN images have `image.domains` or `image.remotePatterns` configured
  □ SSR pages use `Astro.cache.set()` for route caching where appropriate
  □ OG images generated via `experimental_getFontFileURL()` + Satori (not runtime canvas)
  □ React conditional slot rendering verified against Astro hydration (6.1+ fix awareness)
  □ `compressHTML` set to `"jsx"` for consistent whitespace across .astro and .tsx files
  □ i18n pages include `x-default` hreflang link to default locale
```

---

## Step 5 — Present the Output

Present the conversion in this order:

1. **Project scan summary** — what existed vs. what was scaffolded
2. **Classification badge** — state the type (🟢🟣🟡🟠🔴🔵) and reasoning
3. **File map** — list every output file with its resolved path (from Placement Engine)
4. **Code blocks** — full code for each file, in dependency order
5. **What changed** — brief summary of key transformations applied (e.g., "Migrated useActionState to Astro Action", "Stripped useMemo per React Compiler")
6. **Warnings** — flag anything that needs manual attention (missing foundation files, Action configurations, API keys, env vars)

---

## Reference Files

Read these for detailed before/after examples:

- `examples/static-section.md` — Pure layout component → single `.astro` file
- `examples/interactive-section.md` — Stateful / Astro Actions component
- `examples/server-island.md` — Data fetching via Server Islands
- `examples/animation-section.md` — Framer Motion → GSAP split pattern
- `examples/hooks-and-state.md` — React 19 hooks → Server data or stores
- `resources/conversion-checklist.md` — Quick-reference decision map + validation rules

For architectural rules and folder structure, always follow the **`astro-architecture`** skill.
