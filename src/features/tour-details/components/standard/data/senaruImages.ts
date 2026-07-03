import coverImage2DaySenaru from "../../../../../assets/images/tours/mount-rinjani-trek/mount-rinjani-trek-detail/senaru-route/2-day-senaru-crater-rim.avif";
import coverImage3DaySenaru from "../../../../../assets/images/tours/mount-rinjani-trek/mount-rinjani-trek-detail/senaru-route/3-day-senaru-lake.avif";
import coverImage4DaySenaru from "../../../../../assets/images/tours/mount-rinjani-trek/mount-rinjani-trek-detail/senaru-route/4-day-senaru-summit-lake.avif";

import senaruVillage from "../../../../../assets/images/tours/mount-rinjani-trek/mount-rinjani-trek-detail/senaru-route/gallery/senaru-village-trailhead.avif";
import rainforestTrail from "../../../../../assets/images/tours/mount-rinjani-trek/mount-rinjani-trek-detail/senaru-route/gallery/tropical-rainforest.avif";
import pelawanganSenaru from "../../../../../assets/images/tours/mount-rinjani-trek/mount-rinjani-trek-detail/senaru-route/gallery/pelawangan-senaru-crater-rim.avif";
import calderaViews from "../../../../../assets/images/tours/mount-rinjani-trek/mount-rinjani-trek-detail/senaru-route/gallery/panoramic-views-over-rinjani-caldera.avif";
import sasakCulture from "../../../../../assets/images/tours/mount-rinjani-trek/mount-rinjani-trek-detail/senaru-route/gallery/sasak-cultural-heritage.avif";
import segaraAnakLakeSenaru from "../../../../../assets/images/tours/mount-rinjani-trek/mount-rinjani-trek-detail/senaru-route/gallery/segara-anak-lake.avif";
import rinjaniSummitSenaru from "../../../../../assets/images/tours/mount-rinjani-trek/mount-rinjani-trek-detail/senaru-route/gallery/mount-rinjani-summit.avif";

export const senaruHeroImageMap: Record<string, any> = {
  "2-day-senaru-crater-rim": {
    ...coverImage2DaySenaru,
    alt: "Trekker standing on a rocky outcrop at the Senaru crater rim gazing at the turquoise Segara Anak lake and Barujari volcano cone — the viewpoint reached on a Mount Rinjani 2-day Senaru crater rim trek",
  },
  "3-day-senaru-lake": {
    ...coverImage3DaySenaru,
    alt: "Woman sitting at the Rinjani 3,726m summit beside the summit sign with the crater rim, Segara Anak lake, and clouds stretching below — a rewarding moment on a Mount Rinjani 3-day Senaru trek",
  },
  "4-day-senaru-summit-lake": {
    ...coverImage4DaySenaru,
    alt: "Trekker with backpack and poles on a grassy ridge overlooking the full Segara Anak lake, Barujari cone, and steaming hot springs during a Mount Rinjani 4-day Senaru trek",
  },
};

export const senaruHighlightsMap: Record<string, any> = {
  "senaru-village": { ...senaruVillage, alt: "The traditional Sasak village of Senaru at the start of the Mount Rinjani western trail" },
  "rainforest-trail": { ...rainforestTrail, alt: "Lush, dense tropical rainforest trail on the Senaru route of Mount Rinjani" },
  "pelawangan-senaru": { ...pelawanganSenaru, alt: "Campsite at Pelawangan Senaru crater rim at 2,641m above sea level" },
  "caldera-views": { ...calderaViews, alt: "Spectacular panoramic views over Segara Anak lake and Rinjani's massive volcanic caldera" },
  "senaru-rainforest": { ...rainforestTrail, alt: "Dense tropical rainforest canopy on the Senaru trail through Mount Rinjani National Park" },
  "sasak-culture": { ...sasakCulture, alt: "Traditional Sasak village and cultural heritage near the Senaru trailhead of Mount Rinjani" },
  "segara-anak-lake": { ...segaraAnakLakeSenaru, alt: "The sacred turquoise waters of Segara Anak volcanic crater lake at 2,008m on Mount Rinjani" },
  "rinjani-summit": { ...rinjaniSummitSenaru, alt: "Climbers reaching the 3,726m summit of Mount Rinjani via the Senaru route at sunrise" },
};
