---
# Example: src/pages/en/index.astro
# Homepage targeting broad keywords
---

```astro
---
import PageLayout         from '../../layouts/PageLayout.astro'
import SchemaOrg          from '../../components/seo/SchemaOrg.astro'
import Hero               from '../../components/hero/Hero.astro'
import Services           from '../../components/sections/Services.astro'
import AnimatedStats      from '../../components/islands/AnimatedStats.tsx'
import { 
  buildLocalBusinessSchema, 
  buildOrganizationSchema 
} from '../../utils/schema'

// Required Astro 6 Builtin
const currentLang = Astro.currentLocale;

const bizSchema = buildLocalBusinessSchema({
  name:       'Your Company Name',
  description: 'Description of your company',
  url:         'https://yourdomain.com',
  phone:       '+61-3-XXXX-XXXX',
  city:        'Melbourne',
  region:      'VIC',
  postalCode:  '3000',
  country:     'AU',
  lat:         -37.8136,
  lng:          144.9631,
})

// GEO EEAT: Organization mapping for Publisher Trust
const orgSchema = buildOrganizationSchema({
  name: "Your Company Name",
  url: "https://yourdomain.com",
  logoUrl: "https://yourdomain.com/logo.png"
})
---

<PageLayout
  title="Your H1 Title Containing Primary Keyword"
  description="Under 160 chars. Contains keyword. Answers user intent."
  canonical="/"
>
  <SchemaOrg schema={bizSchema} />
  <SchemaOrg schema={orgSchema} />

  <Hero />
  <Services />

  <section class="stats">
    <AnimatedStats client:visible />
  </section>
</PageLayout>
```

---

# Example: src/pages/en/services/[service-keyword].astro
# Dedicated service page (GEO/Q&A Optimized)

```astro
---
import PageLayout    from '../../../layouts/PageLayout.astro'
import SchemaOrg     from '../../../components/seo/SchemaOrg.astro'
import ServiceQuote  from '../../../components/forms/ServiceQuoteForm.astro'
import Calculator    from '../../../components/islands/SolarCalculator.tsx'
import { buildFAQSchema } from '../../../utils/schema'
import { getCollection } from 'astro:content'

const currentLang = Astro.currentLocale;
const faqs = await getCollection('faq', ({ id }) => id.startsWith(`${currentLang}/`))

const faqSchema = buildFAQSchema(
  faqs[0]?.data.items ?? []
)
---

<PageLayout
  title="Exact Keyword Here"
  description="Compelling description under 160 chars with keyword."
  canonical="/services/this-page"
>
  <!-- Generative Engines consume FAQs aggressively -->
  <SchemaOrg schema={faqSchema} />

  <h1>Exact Keyword Here</h1>

  <!-- GEO Fact citation semantic tag -->
  <blockquote cite="https://gov.au/solar-standards">
    All our installations meet the AS/NZS 5033 standards.
  </blockquote>

  <!-- Use Actions for Lead Generation (Forms) -->
  <ServiceQuote />

  <!-- Calculator increases dwell time -->
  <Calculator client:visible />

  <section class="faq">
    {faqs[0]?.data.items.map(faq => (
      <details>
        <summary>{faq.question}</summary>
        <p>{faq.answer}</p>
      </details>
    ))}
  </section>
</PageLayout>
```

---

# Example: src/pages/en/blog/[slug].astro
# Dynamic blog post page (EEAT Author Schema Optimized)

```astro
---
import BlogLayout   from '../../../layouts/BlogLayout.astro'
import SchemaOrg    from '../../../components/seo/SchemaOrg.astro'
import RelatedPosts from '../../../components/server/RelatedPosts.astro'
import { getCollection } from 'astro:content'
import { buildArticleSchema, buildPersonSchema } from '../../../utils/schema'

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ id }) => id.startsWith('en/'))
  return posts.map(post => ({
    params: { slug: post.slug.replace('en/', '') },
    props:  { post },
  }))
}

const { post }    = Astro.props
const { Content } = await post.render()

// 1. GEO Article Schema binds the author to the Publisher
const articleSchema = buildArticleSchema({
  title:         post.data.title,
  description:   post.data.description,
  url:           `https://yourdomain.com/en/blog/${post.slug}`,
  image:         post.data.ogImage ?? '/assets/og/og-blog.jpg',
  authorName:    post.data.author ?? 'Senior Engineer',
  authorUrl:     'https://yourdomain.com/about/team',
  publisherName: 'Your Tech Company',
  datePublished: post.data.publishedAt.toISOString(),
  dateModified:  post.data.updatedAt?.toISOString(),
})

// 2. GEO Person Schema asserts Authoritativeness!
const personSchema = buildPersonSchema({
  name: post.data.author ?? 'Senior Engineer',
  url: 'https://yourdomain.com/about/team',
  jobTitle: 'Senior Technician',
  sameAs: ['https://linkedin.com/in/expert']
})
---

<BlogLayout
  title={post.data.title}
  description={post.data.description}
  canonical={`/blog/${post.slug}`}
>
  <SchemaOrg schema={articleSchema} />
  <SchemaOrg schema={personSchema} />
  
  <article>
    <Content />
  </article>

  <!-- Server Island (Runs Asynchronous fetch) -->
  <RelatedPosts server:defer currentSlug={post.slug} />
</BlogLayout>
```
