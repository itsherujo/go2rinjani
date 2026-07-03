import coverImage2Day from "../../../../../assets/images/tours/mount-rinjani-trek/mount-rinjani-trek-detail/sembalun-route/2-day-sembalun-summit.avif";
import coverImage3Day from "../../../../../assets/images/tours/mount-rinjani-trek/mount-rinjani-trek-detail/sembalun-route/3-day-sembalun-summit-lake.avif";
import coverImage4Day from "../../../../../assets/images/tours/mount-rinjani-trek/mount-rinjani-trek-detail/sembalun-route/4-day-sembalun-expedition.avif";

import sembalunSavannah from "../../../../../assets/images/tours/mount-rinjani-trek/mount-rinjani-trek-detail/sembalun-route/gallery/sembalun-savannah-trail.avif";
import plawanganSembalun from "../../../../../assets/images/tours/mount-rinjani-trek/mount-rinjani-trek-detail/sembalun-route/gallery/plawangan-sembalun-crater-rim.avif";
import rinjaniSummit from "../../../../../assets/images/tours/mount-rinjani-trek/mount-rinjani-trek-detail/sembalun-route/gallery/mount-rinjani-summit.avif";
import sunriseSummit from "../../../../../assets/images/tours/mount-rinjani-trek/mount-rinjani-trek-detail/sembalun-route/gallery/sunrise-above-the-clouds.avif";
import segaraAnakLake from "../../../../../assets/images/tours/mount-rinjani-trek/mount-rinjani-trek-detail/sembalun-route/gallery/segara-anak-lake.avif";
import hotSpring from "../../../../../assets/images/tours/mount-rinjani-trek/mount-rinjani-trek-detail/sembalun-route/gallery/hot-spring.avif";
import toreanRoute from "../../../../../assets/images/tours/mount-rinjani-trek/mount-rinjani-trek-detail/sembalun-route/gallery/torean-route.avif";
import toreanRouteExit from "../../../../../assets/images/tours/mount-rinjani-trek/mount-rinjani-trek-detail/sembalun-route/gallery/torean-route-exit.avif";

export const standardHeroImageMap: Record<string, any> = {
  "2-day-sembalun-summit": {
    ...coverImage2Day,
    alt: "Group of trekkers and their guide posing with the Summit Rinjani 3,726m sign above the crater lake after completing a Mount Rinjani summit trek 2 days via Sembalun",
  },
  "3-day-sembalun-summit-lake": {
    ...coverImage3Day,
    alt: "Guide and two young trekkers posing near the Rinjani summit at dawn with the mountain's shadow cast across the sky and Segara Anak lake below — a highlight of the Mount Rinjani 3-day Sembalun trek",
  },
  "4-day-sembalun-expedition": {
    ...coverImage4Day,
    alt: "Couple celebrating at the Mount Rinjani 3,726m summit with a champagne bottle and the iconic summit sign, crater lake and caldera stretching behind them on a Mount Rinjani 4-day Sembalun expedition",
  },
};

export const standardHighlightsMap: Record<string, any> = {
  "sembalun-savannah": { ...sembalunSavannah, alt: "Hikers walking through the vast golden savannah of the Sembalun trail" },
  "plawangan-sembalun": { ...plawanganSembalun, alt: "Camping tents pitched at Plawangan Sembalun crater rim overlooking Segara Anak lake" },
  "rinjani-summit": { ...rinjaniSummit, alt: "Climbers reaching the 3,726m summit of Mount Rinjani" },
  "sunrise-summit": { ...sunriseSummit, alt: "Spectacular sunrise views above the clouds from the top of Mount Rinjani" },
  "segara-anak-descent": { ...segaraAnakLake, alt: "Descending into the Rinjani crater towards the beautiful Segara Anak volcanic lake" },
  "segara-anak-extended": { ...segaraAnakLake, alt: "Camping for two nights beside the stunning turquoise waters of Segara Anak volcanic lake" },
  "hot-springs": { ...hotSpring, alt: "Trekkers relaxing in the natural volcanic hot springs near Segara Anak lake" },
  "torean-option": { ...toreanRoute, alt: "Scenic view of the lush green Torean valley trail descent from Mount Rinjani" },
  "torean-route": { ...toreanRouteExit, alt: "Descending Mount Rinjani through the dramatic and lush Torean valley route" },
};
