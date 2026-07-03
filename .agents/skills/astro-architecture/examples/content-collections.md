# Content Collections Config Reference

## src/content/config.ts — Full Zod schemas

```ts
import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob, file } from "astro/loaders";

// ── Blog ──────────────────────────────────────────────────────────
const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: ({ image }) =>
    z.object({
      title: z.string().max(60), // SEO: keep under 60 chars
      description: z.string().max(160), // SEO: meta description
      publishedAt: z.coerce.date(),
      updatedAt: z.coerce.date().optional(),
      author: z.string().default("Team"),
      tags: z.array(z.string()).default([]),
      ogImage: image().optional(), // astro:assets typed image
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
    }),
});

// ── Services ─────────────────────────────────────────────────────
const services = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/services" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string(), // icon name for Icon.astro
    order: z.number().default(99),
    featured: z.boolean().default(false),
    price: z
      .object({
        from: z.number(),
        currency: z.string().default("AUD"),
      })
      .optional(),
  }),
});

// ── FAQ ──────────────────────────────────────────────────────────
const faq = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/faq" }),
  schema: z.object({
    title: z.string(),
    items: z.array(
      z.object({
        question: z.string(),
        answer: z.string(),
      }),
    ),
  }),
});

// ── Testimonials ─────────────────────────────────────────────────
const testimonials = defineCollection({
  loader: file("src/content/testimonials/testimonials.json"), // Load JSON directly
  schema: z.array(
    z.object({
      name: z.string(),
      role: z.string().optional(),
      company: z.string().optional(),
      body: z.string(),
      rating: z.number().min(1).max(5).default(5),
      date: z.coerce.date(),
      avatar: z.string().optional(),
    }),
  ),
});

export const collections = { blog, services, faq, testimonials };
```

## src/live.config.ts — Astro 6 Live Content Collections (Request-time)

```ts
import { defineLiveCollection } from 'astro:content';
import { z } from 'astro/zod';
import { cmsLoader } from './loaders/my-cms';

const updates = defineLiveCollection({
  loader: cmsLoader({ apiKey: import.meta.env.MY_API_KEY }),
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    excerpt: z.string(),
    publishedAt: z.coerce.date(),
  }),
});

export const collections = { updates };
```

Usage in `.astro`:
```astro
---
import { getLiveEntry } from 'astro:content';

const { entry: update, error } = await getLiveEntry(
  'updates',
   Astro.params.slug,
);

if (error || !update) {
  return Astro.redirect('/404');
}
---

<h1>{update.data.title}</h1>
```

## src/utils/content.ts — Typed collection helpers

```ts
import { getCollection, type CollectionEntry } from "astro:content";
import type { Lang } from "../i18n/config";

// Get all published blog posts for a language, sorted newest first
export async function getSortedPosts(
  lang: Lang,
): Promise<CollectionEntry<"blog">[]> {
  const posts = await getCollection(
    "blog",
    ({ id, data }) => id.startsWith(`${lang}/`) && !data.draft,
  );
  return posts.sort(
    (a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime(),
  );
}

// Get featured posts only
export async function getFeaturedPosts(lang: Lang, limit = 3) {
  const posts = await getSortedPosts(lang);
  return posts.filter((p) => p.featured).slice(0, limit);
}

// Get services sorted by order field
export async function getSortedServices(lang: Lang) {
  const services = await getCollection("services", ({ id }) =>
    id.startsWith(`${lang}/`),
  );
  return services.sort((a, b) => a.data.order - b.data.order);
}

// Get FAQs for a language
export async function getFAQs(lang: Lang) {
  const faqs = await getCollection("faq", ({ id }) =>
    id.startsWith(`${lang}/`),
  );
  return faqs[0]?.data.items ?? [];
}

// Get all testimonials (language-agnostic)
export async function getTestimonials() {
  const result = await getCollection("testimonials");
  return result[0]?.data ?? [];
}
```

## Example blog post frontmatter (src/content/blog/en/my-post.md)

```md
---
title: "Solar Panel Installation Guide Melbourne 2025"
description: "Complete guide to solar panel installation in Melbourne. Costs, process, rebates, and how to choose a CEC accredited installer."
publishedAt: 2025-01-15
author: "Your Team"
tags: ["solar", "melbourne", "installation", "guide"]
featured: true
---

# Solar Panel Installation Guide Melbourne 2025

Your content here...
```
