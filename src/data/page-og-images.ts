/**
 * OG image sources aligned with each page's hero — no separate uploads needed.
 * Paths are Astro-processed asset URLs (e.g. /_astro/...).
 */
import { homeImages } from "../features/home/data/images";
import { aboutImages } from "../features/about/data/constants";
import { toursHeroImages } from "../features/tours/data/tourLayouts";
import { rinjaniHeroImage } from "../features/mount-rinjani-trek/data/rinjaniImages";

export const PAGE_OG_IMAGES = {
  home: homeImages.hero.src,
  about: aboutImages.hero.src,
  /** First image in the tours hero grid (Sembalun savannah) */
  tours: toursHeroImages[0]!.src,
  mountRinjaniTrek: rinjaniHeroImage.src,
} as const;
