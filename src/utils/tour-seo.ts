import { standardHeroImageMap } from "../features/tour-details/components/standard/data/standardImages";
import { senaruHeroImageMap } from "../features/tour-details/components/standard/data/senaruImages";
import { alternativeHeroImage } from "../features/tour-details/components/alternative/data/alternativeImages";

export { getTourCanonicalPath } from "./tour-routes";

const allHeroImages: Record<string, { src: string }> = {
  ...standardHeroImageMap,
  ...senaruHeroImageMap,
  "mount-stampol-trek": alternativeHeroImage,
};

export function getTourHeroImagePath(slug: string): string | undefined {
  return allHeroImages[slug]?.src;
}
