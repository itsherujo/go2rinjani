# Static Section Conversion — Before / After

## Before: React Component (WhyUs.tsx)

```tsx
import React from "react";
import { useTranslation } from "react-i18next";

interface Feature {
  icon: string;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: "🌿",
    title: "Eco-Friendly",
    description:
      "All our products use sustainable materials sourced responsibly.",
  },
  {
    icon: "⚡",
    title: "High Performance",
    description:
      "Industry-leading efficiency ratings backed by independent testing.",
  },
  {
    icon: "🛡️",
    title: "25-Year Warranty",
    description: "Long-term peace of mind with our comprehensive coverage.",
  },
];

export default function WhyUs() {
  const { t } = useTranslation();

  return (
    <section className="why-us-section">
      <div className="container">
        <h2 className="section-title">{t("whyus.title")}</h2>
        <p className="section-subtitle">{t("whyus.subtitle")}</p>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <span className="feature-icon">{feature.icon}</span>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

## Classification

> 🟢 **STATIC** — No `useState`, `useEffect`, or event handlers.
> Pure presentational component with props and a `.map()` loop.
> Converts entirely to a single `.astro` file.

---

## After: Astro Component

### `src/components/sections/WhyUs.astro`

```astro
---
import { useTranslations } from '../../i18n/utils'

interface Feature {
  icon: string
  title: string
  description: string
}

const { lang } = Astro.locals
const t = useTranslations(lang)

const features: Feature[] = [
  {
    icon: '🌿',
    title: 'Eco-Friendly',
    description: 'All our products use sustainable materials sourced responsibly.',
  },
  {
    icon: '⚡',
    title: 'High Performance',
    description: 'Industry-leading efficiency ratings backed by independent testing.',
  },
  {
    icon: '🛡️',
    title: '25-Year Warranty',
    description: 'Long-term peace of mind with our comprehensive coverage.',
  },
]
---

<section class="why-us-section">
  <div class="container">
    <h2 class="section-title">{t('whyus.title')}</h2>
    <p class="section-subtitle">{t('whyus.subtitle')}</p>

    <div class="features-grid">
      {features.map((feature) => (
        <div class="feature-card">
          <span class="feature-icon">{feature.icon}</span>
          <h3 class="feature-title">{feature.title}</h3>
          <p class="feature-description">{feature.description}</p>
        </div>
      ))}
    </div>
  </div>
</section>

<style>
  .why-us-section {
    padding: var(--space-24) 0;
    background: var(--color-bg);
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--space-4);
    text-align: center;
  }

  .section-title {
    font-family: var(--font-display);
    font-size: var(--text-4xl);
    color: var(--color-text);
    margin-bottom: var(--space-2);
  }

  .section-subtitle {
    font-size: var(--text-lg);
    color: var(--color-text-muted);
    margin-bottom: var(--space-12);
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--space-8);
  }

  .feature-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: var(--space-8);
    transition: transform var(--transition-base), box-shadow var(--transition-base);
  }

  .feature-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
  }

  .feature-icon {
    font-size: var(--text-4xl);
    display: block;
    margin-bottom: var(--space-4);
  }

  .feature-title {
    font-family: var(--font-display);
    font-size: var(--text-xl);
    color: var(--color-text);
    margin-bottom: var(--space-2);
  }

  .feature-description {
    font-size: var(--text-base);
    color: var(--color-text-muted);
    line-height: 1.6;
  }
</style>
```

---

## What Changed

| React                              | Astro                                        |
| ---------------------------------- | -------------------------------------------- |
| `className="..."`                  | `class="..."`                                |
| `key={index}` on `.map()`          | Removed — not needed in `.astro`             |
| `useTranslation()` (react-i18next) | `useTranslations(lang)` in frontmatter       |
| `export default function`          | Removed — `.astro` files export by default   |
| Inline/CSS Module styles           | Scoped `<style>` with `tokens.css` variables |
| `useMemo` / `useCallback`          | Stripped entirely out of the component       |
| PropTypes / Validators             | `import { z } from 'astro/zod'`              |
| `@fontsource/` imports             | Delegated to Astro 6 Built-in Fonts API      |
| `React` import                     | Removed — not needed                         |
