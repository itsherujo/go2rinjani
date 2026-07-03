# Theme Reference — Dark/Light Mode

## src/stores/theme.ts

```ts
import { atom } from "nanostores";

export type Theme = "dark" | "light";

export const theme = atom<Theme>("dark"); // dark = default brand choice

// Call once after store initialises on client
export function initTheme() {
  const stored = localStorage.getItem("theme") as Theme | null;
  const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
  const resolved = stored ?? preferred;
  theme.set(resolved);
  applyTheme(resolved);
}

function applyTheme(value: Theme) {
  document.documentElement.setAttribute("data-theme", value);
  localStorage.setItem("theme", value);
}

theme.subscribe(applyTheme);
```

## ThemeToggle.tsx (island)

```tsx
import { useStore } from "@nanostores/react";
import { theme } from "../stores/theme";
import { useEffect } from "react";
import { initTheme } from "../stores/theme";

export default function ThemeToggle() {
  const current = useStore(theme);

  useEffect(() => {
    initTheme();
  }, []);

  const toggle = () => theme.set(current === "dark" ? "light" : "dark");

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${current === "dark" ? "light" : "dark"} mode`}
      className="p-2 rounded-full transition-colors hover:bg-surface-2"
    >
      {current === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
```

## Inline script in BaseLayout (prevents FOUC)

This MUST be placed before any visible HTML — it runs synchronously before paint.
When using Astro View Transitions (`<ClientRouter />`), add `data-astro-rerun` to ensure it executes on soft navigation.

```astro
<script is:inline data-astro-rerun>
  const stored    = localStorage.getItem('theme')
  const preferred = window.matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light'
  const theme     = stored ?? preferred
  document.documentElement.setAttribute('data-theme', theme)
</script>
```

## Full tokens.css template

```css
/* ── Typography scale ─────────────────────────────── */
:root {
  --font-display: "YourDisplayFont", sans-serif;
  --font-body: "YourBodyFont", sans-serif;
  --font-mono: "JetBrains Mono", monospace;

  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
  --text-4xl: 2.25rem;
  --text-5xl: 3rem;
  --text-6xl: 3.75rem;

  /* ── Spacing ────────────────────────────────────── */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-4: 1rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-24: 6rem;

  /* ── Radius ─────────────────────────────────────── */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-full: 9999px;

  /* ── Transitions ─────────────────────────────────── */
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
  --transition-slow: 400ms ease;
}

/* ── Dark theme ──────────────────────────────────── */
:root[data-theme="dark"] {
  --color-bg: #030712;
  --color-surface: #0f172a;
  --color-surface-2: #1e293b;
  --color-border: #1e293b;
  --color-text: #f1f5f9;
  --color-text-muted: #94a3b8;
  --color-accent: #REPLACE_ME;
  --color-cta: #REPLACE_ME;
  --color-cta-hover: #REPLACE_ME;
}

/* ── Light theme ─────────────────────────────────── */
:root[data-theme="light"] {
  --color-bg: #f8fafc;
  --color-surface: #ffffff;
  --color-surface-2: #f1f5f9;
  --color-border: #e2e8f0;
  --color-text: #0f172a;
  --color-text-muted: #64748b;
  --color-accent: #REPLACE_ME;
  --color-cta: #REPLACE_ME;
  --color-cta-hover: #REPLACE_ME;
}
```
