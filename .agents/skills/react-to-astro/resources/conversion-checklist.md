# React → Astro Conversion Checklist

## Quick Classification Flowchart

```
React component received
│
├─ Has useState / useReducer / onClick / onChange / useActionState?
│  ├─ NO
│  │  ├─ Uses <Suspense> purely for heavy data fetching?
│  │  │  ├─ YES → 🟣 SERVER ISLAND → .astro with `server:defer`
│  │  │  └─ NO  → 🟢 STATIC → single .astro file
│  │  │
│  └─ YES
│     ├─ Is interactivity purely Form Submission/Data Mutation (e.g., onSubmit, useActionState)?
│     │  └─ YES → 🟢 STATIC + ⚡ ASTRO ACTIONS → .astro with standard HTML <form action={actions.myAction}>
│     │
│     ├─ Uses GSAP / Framer Motion / Spring?
│     │  └─ YES → 🟠 ANIMATION → .astro + .tsx + use[X]Animation.ts
│     │
│     ├─ Uses Three.js / R3F / WebGL / Canvas?
│     │  └─ YES → 🔴 3D → .astro + lazy .tsx island + <Suspense>
│     │
│     └─ Otherwise → 🟡 INTERACTIVE → .astro shell + .tsx island
│
├─ Is it a custom hook / utility / schema / pure logic?
│  └─ YES → 🔵 LOGIC → .ts file (store, util, schema, or type)
```

---

## Common API Mapping Table

| React / Legacy Stack                  | Astro 6.1 Modern Standard                      |
| ------------------------------------- | ---------------------------------------------- |
| `className`                           | `class`                                        |
| `htmlFor`                             | `for`                                          |
| `{children}`                          | `<slot />`                                     |
| `{children.sidebar}`                  | `<slot name="sidebar" />`                      |
| `key={id}`                            | Not needed in `.astro` loops                   |
| `<img src={} />`                      | `<Image>` from `astro:assets`                  |
| `dangerouslySetInnerHTML`             | `<Fragment set:html={html} />`                 |
| `<Link to="/">`                       | `<a href="/">` (native links + ClientRouter)   |
| `<title>` / `<meta>` (React 19)       | Move to `<head>` in `BaseLayout.astro`         |
| `style={{ fontSize: '16px' }}`        | `style="font-size: 16px;"` or scoped `<style>` |
| `useState(val)`                       | `atom(val)` from nanostores                    |
| `useActionState` / `useFormStatus`    | `<form action={actions.name}>` (Astro Actions) |
| `useContext(Ctx)`                     | Direct import from `stores/*.ts`               |
| `useEffect(() => fetch(), [])`        | Frontmatter: `const data = await fetch()`      |
| `use(fetchPromise)` (React 19)        | Frontmatter top-level `await`                  |
| `useEffect` (DOM)                     | `<script>` tag in `.astro`                     |
| `useEffect` (localStorage)            | `<script is:inline data-astro-rerun>`          |
| `useRef` (DOM)                        | `document.querySelector()` in `<script>`       |
| `useMemo` / `useCallback` (React 19)  | 🗑️ Strip entirely (Handled by React Compiler)   |
| `React.lazy()`                        | Keep inside `.tsx` island only                 |
| `useTranslation()` (i18next)          | `useTranslations(lang)` in frontmatter         |
| Framer Motion `animate`               | GSAP `gsap.from()` / `gsap.to()`               |
| CSS Modules                           | Scoped `<style>` in `.astro`                   |
| `@fontsource` / Google Fonts          | 🗑️ Strip, use **Astro 6 Built-in Fonts API**    |
| PropTypes / Thick Validations         | `import { z } from 'astro/zod'`                |
| Redux / Zustand                       | nanostores `atom()` / `computed()`             |

---

## Post-Conversion Validation

Run through this checklist after every conversion:

### File Structure

- [ ] Files placed in correct `astro-architecture` canonical paths
- [ ] Static sections/forms in `src/components/sections/` or `src/components`
- [ ] Split sections in `src/components/[section]/`
- [ ] Islands in `src/components/islands/` or co-located with shell
- [ ] Stores in `src/stores/`
- [ ] Schemas in `src/schemas/` (Zod 4)

### .astro Files

- [ ] React 19 memoization (`useMemo`, `useCallback`) entirely stripped out.
- [ ] No `useState`, `useEffect`, `useContext` remaining.
- [ ] No `onClick`, `onChange` (pure UI interaction moves to island).
- [ ] Form `onSubmit` converted to `<form action={actions.yourAction}>`.
- [ ] `use()` hooks replaced with standard top-level `await`.
- [ ] Uses `class` not `className` and `<slot />` not `{children}`.
- [ ] Uses `<Image>` from `astro:assets` — no raw `<img>`.
- [ ] Scoped `<style>` uses `tokens.css` variables — no magic values.
- [ ] Metadata tags hoisted properly to the Layout.

### .tsx Islands

- [ ] Contains ONLY the interactive part — no static layout or basic forms.
- [ ] Has correct `client:*` directive applied in parent `.astro`.
- [ ] No Client Islands used just for API fetching; uses `server:defer` instead.
- [ ] Uses nanostores for shared state — no React Context.
- [ ] For 3D: uses `React.lazy` + `<Suspense>` + explicit dimensions.

### Quality Bars

- [ ] Zod 4 uses `astro/zod` import.
- [ ] Typography fully delegates to Astro 6 Built-in Fonts API.
- [ ] Theme script uses `<script is:inline data-astro-rerun>`.

---

## Common Pitfalls

| Mistake                                | Fix                                                          |
| -------------------------------------- | ------------------------------------------------------------ |
| Wrapping pure forms in React Islands   | Migrate to `.astro` using HTML `<form action={actions}>`     |
| Leaving `useMemo` or `React.memo`      | Delete them; pure HTML components don't need manual memoizing|
| Using Client Islands for heavy APIs    | Convert to Server Islands via `server:defer` fallback        |
| Putting `onClick` in `.astro` file     | Move to `.tsx` island if UI-state; use Action if data-state  |
| Using `useEffect` for data fetching    | Move to Astro frontmatter `await fetch()`                    |
| Using `client:load` on everything      | Default to `client:visible`; use the island decision map     |
| Forgetting `gsap.context()` cleanup    | Always `return () => ctx.revert()` in useEffect              |
