import coverImage from "../../../../../assets/images/tours/mount-stampol-trek/cover/best-rinjani-alternative-trek-lombok.avif";

import imgPlantations from "../../../../../assets/images/tours/mount-stampol-trek/mount-stampol-trek-spice-plantations.avif";
import imgRainforest from "../../../../../assets/images/tours/mount-stampol-trek/mount-stampol-untouched-rainforest.avif";
import imgCraterRim from "../../../../../assets/images/tours/mount-stampol-trek/mount-stampol-crater-rim-sunset.avif";
import imgRinjaniViews from "../../../../../assets/images/tours/mount-stampol-trek/mount-rinjani-caldera-view-stampol.avif";

export const alternativeHeroImage = {
  ...coverImage,
  alt: "A couple standing at Mount Stampol crater rim, the best Rinjani alternative trek in Lombok",
};

export const alternativeHighlightsMap: Record<string, any> = {
  "plantations": { ...imgPlantations, alt: "Hiking through aromatic spice plantations at the trailhead of Mount Stampol Trek, Lombok" },
  "rainforest": { ...imgRainforest, alt: "Dense and lush untouched rainforest on the upper slopes of Mount Stampol in Rinjani National Park" },
  "crater-rim": { ...imgCraterRim, alt: "Breathtaking sunset view from the Mount Stampol crater rim camping area at 2,608 meters" },
  "rinjani-views": { ...imgRinjaniViews, alt: "Clear panoramic view of Mount Rinjani and Segara Anak lake from the Stampol crater rim trail" },
};
