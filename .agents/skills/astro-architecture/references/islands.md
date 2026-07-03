# Islands Reference — Client, Server, and Actions

## 1. Client Islands (The Split Pattern)

Use for heavy UI animations, canvas, or complex React state:

```
src/components/[section]/
├── [Section].astro           ← static shell, layout, SEO content, zero JS
├── [SectionIsland].tsx       ← ONLY the interactive/animated part
└── use[Section]Animation.ts  ← all hook/GSAP logic, no JSX
```

### All client: directives with real examples
```astro
<!-- CRITICAL — above fold, user sees immediately -->
<ThemeToggle   client:load />

<!-- DEFAULT — below fold, common choice -->
<Calculator    client:visible />

<!-- LOW PRIORITY — background, non-critical -->
<CookieConsent client:idle />

<!-- BROWSER-ONLY — uses window/document -->
<ThreeScene    client:only="react" />
```

---

## 2. Server Islands (Astro 6 Async Shells)

Use for heavily personalized UI or slow third-party API data. This completely avoids executing JavaScript on the client while providing instant HTML on the server.

Always place these components in `src/components/server/`.

```astro
---
// src/components/server/RecommendedProducts.astro
// This is a heavy server component. It fetches a slow API.
import Recommendations from '../../lib/api';

const userId = Astro.cookies.get('session_id')?.value;
const products = await Recommendations.fetchPersonalized(userId);
---

<div class="grid">
  {products.map(p => <ProductCard p={p} />)}
</div>
```

**Usage (triggers asynchronous load without blocking main page):**
```astro
---
import ProductRecs from '../components/server/RecommendedProducts.astro';
---
<section id="recommendations">
  <h2>Just For You</h2>
  <ProductRecs server:defer>
    <div slot="fallback">Loading personalized gear...</div>
  </ProductRecs>
</section>
```

---

## 3. Astro Actions (Zero-JS Forms)

Never use `onSubmit` in a `client:load` Island for mutations anymore. Always use Astro Actions for forms.

Place form UI in `src/components/forms/`.
Place actions logic in `src/actions/index.ts`.

```astro
---
// src/components/forms/NewsletterForm.astro
import { actions } from 'astro:actions';
---

<form action={actions.newsletter.subscribe}>
  <input type="email" name="email" required />
  <button type="submit">Subscribe</button>
</form>
```

```ts
// src/actions/index.ts
import { defineAction } from 'astro:actions';
import { z } from 'astro/zod';

export const server = {
  newsletter: {
    subscribe: defineAction({
      accept: 'form',
      input: z.object({ email: z.string().email() }),
      handler: async ({ email }) => {
        // Run DB/API backend mutation safely
        return { success: true };
      }
    })
  }
}
```

---

## 4. nanostores for cross-island state (Client Only)

Use nanostores when two *Client Islands* need to share state. Never pass props between islands — they are isolated by design.

```ts
// src/stores/cart.ts
import { atom } from "nanostores";
export const cartCount = atom<number>(0);
```

```tsx
// Any client island
import { useStore } from "@nanostores/react";
import { cartCount } from "../stores/cart";

export default function CartBadge() {
  const count = useStore(cartCount);
  return <span>{count}</span>;
}
```
