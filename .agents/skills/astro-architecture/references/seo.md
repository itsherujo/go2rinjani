# SEO & GEO Reference (E-E-A-T Standards)

## src/components/seo/SEOHead.astro

```astro
---
import { hreflangMap } from '../../i18n/config'
import type { Lang } from '../../i18n/config'

interface Props {
  title:       string
  description: string
  canonical:   string
  lang:        Lang
  ogImage?:    string
  noindex?:    boolean
}

const {
  title,
  description,
  canonical,
  lang,
  ogImage = '/assets/og/og-default.jpg',
  noindex = false,
} = Astro.props

const siteUrl  = Astro.site ? Astro.site.toString().replace(/\/$/, '') : "https://placeholder-url.com"
const fullUrl  = `${siteUrl}${canonical}`
const fullOG   = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`
const fullTitle = `${title} | Your Brand`
---

<!-- Primary -->
<title>{fullTitle}</title>
<meta name="description" content={description} />
<link rel="canonical" href={fullUrl} />
{noindex && <meta name="robots" content="noindex, nofollow" />}

<!-- hreflang — critical for GEO & SEO routing -->
{Object.entries(hreflangMap).map(([langCode, hreflang]) => (
  <link rel="alternate" hreflang={hreflang} href={`${siteUrl}/${langCode}${canonical}`} />
))}
<link rel="alternate" hreflang="x-default" href={`${siteUrl}/en${canonical}`} />

<!-- Open Graph -->
<meta property="og:type"        content="website" />
<meta property="og:url"         content={fullUrl} />
<meta property="og:title"       content={fullTitle} />
<meta property="og:description" content={description} />
<meta property="og:image"       content={fullOG} />
<meta property="og:locale"      content={lang === 'en' ? 'en_AU' : 'zh_CN'} />

<!-- Twitter Card -->
<meta name="twitter:card"        content="summary_large_image" />
<meta name="twitter:title"       content={fullTitle} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image"       content={fullOG} />
```

## src/utils/schema.ts — GEO Schema Builders

```ts
// 1. Trustworthiness (GEO) — The core validating entity (Publisher)
export function buildOrganizationSchema(config: {
  name: string;
  url: string;
  logoUrl: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: config.name,
    url: config.url,
    logo: {
      "@type": "ImageObject",
      url: config.logoUrl,
    },
  };
}

// 2. Authoritativeness (GEO) — The expert validating the content
export function buildPersonSchema(config: {
  name: string;
  url: string;
  jobTitle?: string;
  sameAs?: string[]; // links to LinkedIn/X for EEAT
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: config.name,
    url: config.url,
    jobTitle: config.jobTitle,
    sameAs: config.sameAs ?? [],
  };
}

// Article — for blog posts (Strong E-E-A-T binding)
export function buildArticleSchema(config: {
  title: string;
  description: string;
  url: string;
  image: string;
  authorName: string;
  authorUrl: string;
  publisherName: string;
  datePublished: string;
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: config.title,
    description: config.description,
    url: config.url,
    image: config.image,
    datePublished: config.datePublished,
    dateModified: config.dateModified ?? config.datePublished,
    author: {
      "@type": "Person",
      name: config.authorName,
      url: config.authorUrl,
    },
    publisher: {
      "@type": "Organization",
      name: config.publisherName,
    },
  };
}

// LocalBusiness
export function buildLocalBusinessSchema(config: {
  name: string;
  description: string;
  url: string;
  phone: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  lat: number;
  lng: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: config.name,
    description: config.description,
    url: config.url,
    telephone: config.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: config.city,
      addressRegion: config.region,
      postalCode: config.postalCode,
      addressCountry: config.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: config.lat,
      longitude: config.lng,
    },
  };
}

// FAQPage — Generative Engine Optimization Core pattern
export function buildFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// BreadcrumbList
export function buildBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
```

## src/components/seo/SchemaOrg.astro — Dispatcher

```astro
---
interface Props {
  schema: Record<string, unknown>
}
const { schema } = Astro.props
---

<script type="application/ld+json" set:html={JSON.stringify(schema)} />
```
