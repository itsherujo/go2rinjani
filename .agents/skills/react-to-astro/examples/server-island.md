# Server Island Conversion — Before / After

## Before: React Component (ProductRecommendations.tsx)

```tsx
import React, { Suspense } from "react";
// Assumes React 19 `use` hook for data fetching
import { use } from "react";

const fetchRecommendations = async (productId: string) => {
  const res = await fetch(`/api/recommendations?productId=${productId}`);
  return res.json();
};

function RecommendationList({ productId }: { productId: string }) {
  const recommendations = use(fetchRecommendations(productId));
  
  return (
    <ul className="recommendation-list">
      {recommendations.map((item: any) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}

export default function ProductRecommendations({ productId }: { productId: string }) {
  return (
    <section className="recommendations-container">
      <h2>You Might Also Like</h2>
      <Suspense fallback={<div className="loading-spinner">Loading recommendations...</div>}>
        <RecommendationList productId={productId} />
      </Suspense>
    </section>
  );
}
```

---

## Classification

> 🟣 **SERVER ISLAND** — Component relies on `<Suspense>` to handle heavy asynchronous data fetching. It doesn't require client-side execution for interactivity (`useState`, `onClick`, etc.), so it should NOT be an island!
> Convert to Astro Server Island (`server:defer`) to avoid blocking the main server render.

---

## After: Astro Files

### `src/components/products/ProductRecommendations.astro` (Parent Shell)

```astro
---
import RecommendationList from './RecommendationList.astro'

interface Props {
  productId: string
}

const { productId } = Astro.props
---

<section class="recommendations-container">
  <h2>You Might Also Like</h2>
  
  <!-- Server Island handles the heavy lifting post-render -->
  <RecommendationList productId={productId} server:defer>
    <div slot="fallback" class="loading-spinner">
      Loading recommendations...
    </div>
  </RecommendationList>
</section>

<style>
  .recommendations-container {
    padding: var(--space-8);
    border-top: 1px solid var(--color-border);
  }
  
  .loading-spinner {
    color: var(--color-text-muted);
    font-style: italic;
  }
</style>
```

### `src/components/products/RecommendationList.astro` (Server Component)

```astro
---
interface Props {
  productId: string
}

const { productId } = Astro.props

// React's `use(promise)` becomes standard top-level await
const res = await fetch(`https://api.internal/recommendations?productId=${productId}`)
const recommendations = await res.json()
---

<ul class="recommendation-list">
  {recommendations.map((item: any) => (
    <li>{item.name}</li>
  ))}
</ul>

<style>
  .recommendation-list {
    display: flex;
    gap: var(--space-4);
    list-style: none;
    padding: 0;
  }
  
  li {
    background: var(--color-surface);
    padding: var(--space-4);
    border-radius: var(--radius-md);
  }
</style>
```

---

## What Changed

| React                                | Astro 6                                     |
| ------------------------------------ | ------------------------------------------- |
| `use(fetchPromise)` + `<Suspense>`   | Top-level `await` + `server:defer` fallback |
| Client-side rendering delay          | Fully Server Rendered Streams (Zero-JS)     |
| Bundled JavaScript sent to client    | HTML is shipped and stream-appended         |
