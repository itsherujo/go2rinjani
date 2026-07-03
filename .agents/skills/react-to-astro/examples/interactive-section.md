# Interactive Section Conversion — Before / After

## Before: React Component (FAQSection.tsx)

```tsx
import React, { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title: string;
  subtitle: string;
  faqs: FAQItem[];
}

export default function FAQSection({ title, subtitle, faqs }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <div className="container">
        <h2 className="faq-title">{title}</h2>
        <p className="faq-subtitle">{subtitle}</p>

        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${openIndex === index ? "open" : ""}`}
            >
              <button className="faq-question" onClick={() => toggle(index)}>
                <span>{faq.question}</span>
                <span className="faq-icon">
                  {openIndex === index ? "−" : "+"}
                </span>
              </button>
              {openIndex === index && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
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

> 🟡 **INTERACTIVE** — Uses `useState` and `onClick` handlers purely for **UI layout changes** (accordion toggle).
> No animation libraries. Split into `.astro` static shell + `.tsx` island.
> *Note: If this were an `onSubmit` handler mutating data, it would be classified as **🟢 STATIC + ⚡ ASTRO ACTIONS** instead.*

---

## After: Astro Files

### File 1: `src/components/faq/FAQSection.astro` — Static Shell

```astro
---
/**
 * FAQSection — static shell
 * Renders the heading, subtitle, and SEO-visible content.
 * Delegates interactivity to the FAQAccordion island.
 */
import FAQAccordion from './FAQAccordion'
import { useTranslations } from '../../i18n/utils'

interface Props {
  faqs: { question: string; answer: string }[]
}

const { lang } = Astro.locals
const t = useTranslations(lang)
const { faqs } = Astro.props
---

<section class="faq-section">
  <div class="container">
    <h2 class="faq-title">{t('faq.title')}</h2>
    <p class="faq-subtitle">{t('faq.subtitle')}</p>

    <!--
      All FAQ text is rendered in the static HTML for SEO crawlers.
      The island adds open/close interactivity on top.
    -->
    <FAQAccordion faqs={faqs} client:visible />

    <!-- Hidden SEO fallback: crawlers see all answers even without JS -->
    <noscript>
      <div class="faq-list">
        {faqs.map((faq) => (
          <div class="faq-item">
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </div>
    </noscript>
  </div>
</section>

<style>
  .faq-section {
    padding: var(--space-24) 0;
    background: var(--color-bg);
  }

  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 var(--space-4);
  }

  .faq-title {
    font-family: var(--font-display);
    font-size: var(--text-4xl);
    color: var(--color-text);
    text-align: center;
    margin-bottom: var(--space-2);
  }

  .faq-subtitle {
    font-size: var(--text-lg);
    color: var(--color-text-muted);
    text-align: center;
    margin-bottom: var(--space-12);
  }
</style>
```

### File 2: `src/components/faq/FAQAccordion.tsx` — Interactive Island

```tsx
import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

interface Props {
  faqs: FAQItem[];
}

export default function FAQAccordion({ faqs }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-list">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className={`faq-item ${openIndex === index ? "open" : ""}`}
        >
          <button
            className="faq-question"
            onClick={() => toggle(index)}
            aria-expanded={openIndex === index}
          >
            <span>{faq.question}</span>
            <span className="faq-icon" aria-hidden="true">
              {openIndex === index ? "−" : "+"}
            </span>
          </button>
          <div
            className="faq-answer"
            style={{
              maxHeight: openIndex === index ? "500px" : "0",
              overflow: "hidden",
              transition: "max-height 0.3s ease",
            }}
          >
            <p>{faq.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
```

> **Note:** The `.tsx` island keeps `className` (valid JSX). Only `.astro` files use `class`.
> The island uses `client:visible` because the FAQ section is typically below the fold.

---

## What Changed

| React (original)              | Astro (converted)                                         |
| ----------------------------- | --------------------------------------------------------- |
| Single monolithic component   | Split into `.astro` shell + `.tsx` island                 |
| All HTML ships with JS bundle | Headings/subtitles are static HTML (zero JS)              |
| SEO: crawler must execute JS  | SEO: all FAQ text visible in HTML + `<noscript>` fallback |
| `useTranslation()`            | `useTranslations(lang)` in `.astro` frontmatter           |
| Always hydrated               | Only hydrated when scrolled into view (`client:visible`)  |
| No a11y attributes            | Added `aria-expanded` and `aria-hidden`                   |
