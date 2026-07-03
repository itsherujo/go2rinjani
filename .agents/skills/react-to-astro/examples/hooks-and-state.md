# Hooks & State Conversion — Before / After

## Example 1: useContext (Theme) → Nanostores

### Before (React)

```tsx
// ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = "dark" | "light";

const ThemeContext = createContext<{
  theme: Theme;
  toggle: () => void;
}>({ theme: "dark", toggle: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    setTheme(stored ?? preferred);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
```

```tsx
// ThemeToggle.tsx (consumer)
import { useTheme } from "./ThemeContext";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return <button onClick={toggle}>{theme === "dark" ? "☀️" : "🌙"}</button>;
}
```

### After (Astro + nanostores)

**Classification:** 🔵 LOGIC-ONLY (the context → store) + 🟡 INTERACTIVE (the toggle button)

#### `src/stores/theme.ts` — replaces ThemeContext entirely

```ts
import { atom } from "nanostores";

export type Theme = "dark" | "light";

export const theme = atom<Theme>("dark");

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

#### `src/components/shared/ThemeToggle.tsx` — island (no Provider needed)

```tsx
import { useStore } from "@nanostores/react";
import { theme, initTheme } from "../../stores/theme";
import { useEffect } from "react";

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
    >
      {current === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
```

> **Key insight:** The `ThemeProvider` wrapper is completely eliminated. Nanostores
> are global singletons — any island can `import { theme }` directly. No more
> prop drilling or Context boilerplate.

---

## Example 2: useEffect(fetch) → Astro Frontmatter

### Before (React)

```tsx
import React, { useState, useEffect } from "react";

interface Post {
  id: number;
  title: string;
  excerpt: string;
}

export default function LatestPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/posts?limit=3")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <section className="latest-posts">
      {posts.map((post) => (
        <article key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </section>
  );
}
```

### After (Astro)

**Classification:** 🟢 STATIC — the `useEffect(fetch)` runs once on mount for data,
component is otherwise purely presentational. Data fetching moves to frontmatter.

#### `src/components/sections/LatestPosts.astro`

```astro
---
import { getSortedPosts } from '../../utils/content'

const { lang } = Astro.locals
const posts = await getSortedPosts(lang)
const latestPosts = posts.slice(0, 3)
---

<section class="latest-posts">
  {latestPosts.map((post) => (
    <article>
      <h3>{post.data.title}</h3>
      <p>{post.data.description}</p>
    </article>
  ))}
</section>

<style>
  .latest-posts {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--space-8);
    padding: var(--space-16) 0;
  }

  article {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: var(--space-8);
  }

  h3 {
    font-family: var(--font-display);
    font-size: var(--text-xl);
    color: var(--color-text);
    margin-bottom: var(--space-2);
  }

  p {
    color: var(--color-text-muted);
    line-height: 1.6;
  }
</style>
```

> **Key insight:** No loading state needed! Astro fetches data at build time (SSG)
> or request time (SSR). The HTML ships with data already rendered — instant
> load, perfect SEO, zero JS.

---

## Example 3: Custom Hook (useLocalStorage) → Astro Script

### Before (React)

```tsx
function useLocalStorage<T>(key: string, initialValue: T) {
  const [stored, setStored] = useState<T>(() => {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(stored));
  }, [key, stored]);

  return [stored, setStored] as const;
}
```

### After (Astro)

**Classification:** 🔵 LOGIC-ONLY — extract to nanostore.

#### `src/stores/persisted.ts`

```ts
import { atom } from "nanostores";

/**
 * Creates a nanostores atom that persists to localStorage.
 * Usage: const myStore = persistedAtom('key', defaultValue)
 */
export function persistedAtom<T>(key: string, initial: T) {
  const store = atom<T>(initial);

  // Only runs on client — nanostores handle SSR safely
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        store.set(JSON.parse(stored));
      } catch {
        store.set(initial);
      }
    }

    store.subscribe((value) => {
      localStorage.setItem(key, JSON.stringify(value));
    });
  }

  return store;
}
```

#### Usage in any island:

```tsx
import { useStore } from "@nanostores/react";
import { persistedAtom } from "../../stores/persisted";

const userPrefs = persistedAtom("user-prefs", { notifications: true });

export default function PrefsToggle() {
  const prefs = useStore(userPrefs);
  return (
    <button
      onClick={() =>
        userPrefs.set({ ...prefs, notifications: !prefs.notifications })
      }
    >
      Notifications: {prefs.notifications ? "ON" : "OFF"}
    </button>
  );
}
```

---

## Example 4: Form Actions (useActionState) → Astro Actions

### Before (React 19)

```tsx
import { useActionState } from "react";
import { submitReview } from "./actions";

export default function ReviewForm() {
  const [state, action, isPending] = useActionState(submitReview, null);

  return (
    <form action={action}>
      <textarea name="comment" />
      <button disabled={isPending}>
        {isPending ? "Submitting..." : "Submit Review"}
      </button>
      {state?.error && <p className="error">{state.error}</p>}
    </form>
  );
}
```

### After (Astro 6)

**Classification:** 🟢 STATIC + ⚡ ASTRO ACTIONS — The component only handles form submission. No client island necessary.

#### `src/components/forms/ReviewForm.astro`

```astro
---
import { actions } from 'astro:actions';

// Astro automatically provides `Astro.getActionResult` to check form state
const result = Astro.getActionResult(actions.submitReview);
const error = result?.error;
---

<form action={actions.submitReview} method="POST">
  <textarea name="comment" required></textarea>
  <button type="submit">Submit Review</button>
  
  {error && <p class="error">{error.message}</p>}
</form>

<style>
  /* Use CSS to handle pending state visually since we have a Zero-JS fallback. */
  form:valid button[type="submit"]:active {
    opacity: 0.7;
  }
</style>
```

---

## Quick Reference: Hook → Astro Pattern

| React Hook / Feature                 | Astro 6 Equivalent                                   |
| ------------------------------------ | ---------------------------------------------------- |
| `useState(value)`                    | `atom(value)` from nanostores                        |
| `useReducer(reducer, init)`          | `atom(init)` + action functions in store `.ts`       |
| `useContext(Ctx)`                    | Direct import from `src/stores/*.ts` (no Provider)   |
| `useEffect(() => fetch(), [])`       | Astro frontmatter: `const data = await fetch()`      |
| `use(fetchPromise)`                  | Astro frontmatter top-level `await`                  |
| `useActionState` / `useFormStatus`   | Astro Actions `<form action={actions.myAction}>`     |
| `useEffect(() => { dom stuff }, [])` | `<script>` tag in `.astro` file                      |
| `useEffect(() => { localStorage })`  | `<script is:inline data-astro-rerun>`                |
| `useRef(null)` for DOM               | `document.querySelector()` in `<script>` tag         |
| `useRef(value)` for mutable value    | Regular `let` variable in `<script>` or store        |
| `useMemo`, `useCallback`, `memo`     | 🗑️ Strip entirely (React Compiler / unused in HTML)   |
| `React.lazy(() => import(...))`      | Keep in `.tsx` island only — for heavy 3D components |
| `useLocalStorage(key, val)`          | `persistedAtom(key, val)` from nanostores            |
| `useMediaQuery(query)`               | `client:media="(query)"` directive on the island     |
