# Animation Section Conversion — Before / After

## Before: React Component with Framer Motion (Hero.tsx)

```tsx
import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface HeroProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
}

export default function Hero({ title, subtitle, backgroundImage }: HeroProps) {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      className="hero-section"
      style={{ position: "relative", overflow: "hidden" }}
    >
      <motion.div
        className="hero-parallax"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          y,
        }}
      />

      <div className="hero-content">
        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {title}
        </motion.h1>

        <motion.p
          className="hero-subtitle"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ opacity }}
        >
          {subtitle}
        </motion.p>

        <motion.a
          href="#contact"
          className="hero-cta"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Get Started
        </motion.a>
      </div>
    </section>
  );
}
```

---

## Classification

> 🟠 **ANIMATION** — Uses Framer Motion for scroll-linked parallax and entry
> animations. No React state needed beyond animation — so the animation can
> live in a `<script>` tag rather than a React island.

---

## After: Astro Files

### File 1: `src/components/hero/Hero.astro` — Static Shell + GSAP Script

Since this component doesn't need React state (the only "interactivity" is animation),
we skip the `.tsx` island entirely and use a `<script>` tag with GSAP directly.

```astro
---
import { Image } from 'astro:assets'
import { useTranslations } from '../../i18n/utils'
import heroImage from '../../assets/hero-bg.jpg'

interface Props {
  title: string
  subtitle: string
}

const { lang } = Astro.locals
const t = useTranslations(lang)
const { title, subtitle } = Astro.props
---

<section class="hero-section" id="hero">
  <div class="hero-parallax">
    <Image
      src={heroImage}
      alt=""
      widths={[640, 1024, 1920]}
      sizes="100vw"
      loading="eager"
      class="hero-bg-image"
    />
  </div>

  <div class="hero-content">
    <h1 class="hero-title">{title}</h1>
    <p class="hero-subtitle">{subtitle}</p>
    <a href="#contact" class="hero-cta">{t('hero.cta')}</a>
  </div>
</section>

<!-- GSAP animation — replaces Framer Motion entirely -->
<script>
  import { gsap } from 'gsap'
  import { ScrollTrigger } from 'gsap/ScrollTrigger'

  gsap.registerPlugin(ScrollTrigger)

  // Entry animations (replaces motion initial/animate)
  gsap.from('.hero-title', {
    opacity: 0,
    y: 60,
    duration: 0.8,
    ease: 'power3.out',
  })

  gsap.from('.hero-subtitle', {
    opacity: 0,
    y: 40,
    duration: 0.8,
    delay: 0.2,
    ease: 'power3.out',
  })

  // Parallax on scroll (replaces useScroll + useTransform)
  ScrollTrigger.create({
    trigger: '#hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true,
    onUpdate: (self) => {
      gsap.set('.hero-parallax', { y: self.progress * -150 })
      gsap.set('.hero-subtitle', { opacity: 1 - self.progress * 2 })
    },
  })

  // Hover effect on CTA (replaces whileHover / whileTap)
  const cta = document.querySelector('.hero-cta') as HTMLElement
  if (cta) {
    cta.addEventListener('mouseenter', () => {
      gsap.to(cta, { scale: 1.05, duration: 0.2, ease: 'power2.out' })
    })
    cta.addEventListener('mouseleave', () => {
      gsap.to(cta, { scale: 1, duration: 0.2, ease: 'power2.out' })
    })
  }
</script>

<style>
  .hero-section {
    position: relative;
    height: 100vh;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .hero-parallax {
    position: absolute;
    inset: -150px 0 0 0;
    z-index: 0;
  }

  .hero-bg-image {
    width: 100%;
    height: calc(100% + 150px);
    object-fit: cover;
  }

  .hero-content {
    position: relative;
    z-index: 1;
    text-align: center;
    padding: 0 var(--space-4);
  }

  .hero-title {
    font-family: var(--font-display);
    font-size: var(--text-6xl);
    color: var(--color-text);
    margin-bottom: var(--space-4);
  }

  .hero-subtitle {
    font-size: var(--text-xl);
    color: var(--color-text-muted);
    max-width: 600px;
    margin: 0 auto var(--space-8);
    line-height: 1.6;
  }

  .hero-cta {
    display: inline-block;
    padding: var(--space-4) var(--space-8);
    background: var(--color-cta);
    color: white;
    border-radius: var(--radius-lg);
    font-weight: 600;
    text-decoration: none;
    transition: background var(--transition-base);
    will-change: transform;
  }

  .hero-cta:hover {
    background: var(--color-cta-hover);
  }
</style>
```

---

## Alternative: When React State IS Needed

If the hero also had state (e.g. a 3D scene toggle, form overlay), you would use the
three-file split pattern instead:

```
src/components/hero/
├── Hero.astro                ← static shell (HTML above)
├── HeroIsland.tsx            ← client:visible island with state
└── useHeroAnimation.ts       ← GSAP logic extracted into hook
```

The `useHeroAnimation.ts` hook would look like:

```ts
// src/components/hero/useHeroAnimation.ts
import { useEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useHeroAnimation(ref: RefObject<HTMLElement>) {
  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      gsap.from(".hero-title", {
        opacity: 0,
        y: 60,
        duration: 0.8,
        ease: "power3.out",
      });
      gsap.from(".hero-subtitle", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        delay: 0.2,
        ease: "power3.out",
      });

      ScrollTrigger.create({
        trigger: ref.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          gsap.set(".hero-parallax", { y: self.progress * -150 });
        },
      });
    }, ref);

    return () => ctx.revert(); // Always clean up
  }, []);
}
```

---

## Framer Motion → GSAP Cheat Sheet

| Framer Motion                           | GSAP Equivalent                                                 |
| --------------------------------------- | --------------------------------------------------------------- |
| `initial={{ opacity: 0, y: 60 }}`       | `gsap.from(el, { opacity: 0, y: 60 })`                          |
| `animate={{ opacity: 1, y: 0 }}`        | (default end state — GSAP animates FROM)                        |
| `transition={{ duration: 0.8 }}`        | `{ duration: 0.8, ease: "power3.out" }`                         |
| `transition={{ delay: 0.2 }}`           | `{ delay: 0.2 }`                                                |
| `whileInView={{ opacity: 1 }}`          | `ScrollTrigger: { trigger, start: "top 80%" }`                  |
| `useScroll()`                           | `ScrollTrigger.create({ scrub: true })`                         |
| `useTransform(scroll, [0,1], [0,-100])` | `onUpdate: (self) => gsap.set(el, { y: self.progress * -100 })` |
| `whileHover={{ scale: 1.05 }}`          | `mouseenter` listener + `gsap.to(el, { scale: 1.05 })`          |
| `whileTap={{ scale: 0.95 }}`            | `mousedown` listener + `gsap.to(el, { scale: 0.95 })`           |
| `AnimatePresence`                       | `gsap.timeline()` with enter/exit tweens                        |
| `variants` with stagger                 | `gsap.from(els, { stagger: 0.1 })`                              |
| `layoutId` (shared layout)              | `gsap.to()` with `Flip` plugin                                  |
