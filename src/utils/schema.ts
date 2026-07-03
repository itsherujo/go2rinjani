import { SITE } from "../data/site";

export function buildOrganizationSchema(config?: {
  name?: string;
  url?: string;
  logoUrl?: string;
  sameAs?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: config?.name ?? SITE.name,
    url: config?.url ?? SITE.url,
    logo: {
      "@type": "ImageObject",
      url: config?.logoUrl ?? `${SITE.url}${SITE.logoPath}`,
    },
    sameAs: config?.sameAs ?? [...SITE.sameAs],
    telephone: SITE.phone,
  };
}

export function buildWebSiteSchema(config?: { name?: string; url?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: config?.name ?? SITE.name,
    url: config?.url ?? SITE.url,
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
    },
  };
}

export function buildArticleSchema(config: {
  title: string;
  description: string;
  url: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  authorUrl?: string;
  publisherName?: string;
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
      "@type": "Organization",
      name: config.authorName ?? SITE.name,
      url: config.authorUrl ?? SITE.url,
    },
    publisher: {
      "@type": "Organization",
      name: config.publisherName ?? SITE.name,
      logo: {
        "@type": "ImageObject",
        url: `${SITE.url}${SITE.logoPath}`,
      },
    },
  };
}

export function buildLocalBusinessSchema(config: {
  name: string;
  description: string;
  url: string;
  phone: string;
  streetAddress: string;
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
      streetAddress: config.streetAddress,
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

export function buildBreadcrumbSchema(
  items: { name: string; url: string }[],
) {
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

export function buildTouristTripSchema(config: {
  name: string;
  description: string;
  url: string;
  image?: string;
  providerName?: string;
  providerUrl?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: config.name,
    description: config.description,
    url: config.url,
    ...(config.image ? { image: config.image } : {}),
    touristType: "Adventure traveler",
    provider: {
      "@type": "TravelAgency",
      name: config.providerName ?? SITE.name,
      url: config.providerUrl ?? SITE.url,
    },
  };
}

export function buildItemListSchema(config: {
  name: string;
  description?: string;
  items: { name: string; url: string; description?: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: config.name,
    ...(config.description ? { description: config.description } : {}),
    itemListElement: config.items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: item.url,
      ...(item.description ? { description: item.description } : {}),
    })),
  };
}

export function buildWebPageSchema(config: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: config.name,
    description: config.description,
    url: config.url,
    isPartOf: {
      "@type": "WebSite",
      name: SITE.name,
      url: SITE.url,
    },
  };
}
