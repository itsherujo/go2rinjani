import rinjaniSummit from "../../../assets/images/tours/mount-rinjani-trek/summit-trek.avif";
import rinjaniSenaru from "../../../assets/images/tours/mount-rinjani-trek/senaru-trek.avif";
import rinjaniTorean from "../../../assets/images/tours/mount-rinjani-trek/torean-trek.avif";

import stampolBestAlt from "../../../assets/images/tours/mount-stampol-trek/cover/best-rinjani-alternative-trek-lombok.avif";
import stampolSunrise from "../../../assets/images/tours/mount-stampol-trek/cover/mount-stampol-trek-sunrise-view-agung.avif";

import heroImg1 from "../../../assets/images/tours/sembalun-route-savannah-trekking.avif";
import heroImg2 from "../../../assets/images/tours/segara-anak-crater-lake-rinjani.avif";
import heroImg3 from "../../../assets/images/tours/rinjani-volcanic-hot-springs-waterfall.avif";
import heroImg4 from "../../../assets/images/tours/mount-rinjani-summit-sunrise-view.avif";

export const packageLayouts: Record<
  string,
  { images: any[]; cols: string }
> = {
  "mount-rinjani": {
    images: [
      { ...rinjaniSummit, alt: "Trekker doing a headstand at the Mount Rinjani 3,726m summit marker with the crater lake and clouds far below" },
      { ...rinjaniSenaru, alt: "Hiker sitting on a log along the Senaru route, overlooking the turquoise Segara Anak crater lake and Rinjani's volcanic rim" },
      { ...rinjaniTorean, alt: "Couple posing on a green ridge during a Mount Rinjani tour with the steaming crater lake and lush slopes behind them" },
    ],
    cols: "1.6fr 1.3fr 1.1fr",
  },
};

export const stampolCalloutLayout = {
  images: [
    { ...stampolBestAlt, alt: "Trekker standing between towering green cliff walls on the Mount Stampol valley trail in Lombok" },
    { ...stampolSunrise, alt: "Mount Agung peak rising above a sea of clouds as seen from the Mount Stampol trek near Rinjani" },
  ],
  cols: "1fr 2fr",
};

export const toursHeroImages = [
  {
    ...heroImg1,
    alt: "Trekker resting on a rocky ridge along the Sembalun route with rolling green hills stretching to the coast below",
  },
  {
    ...heroImg2,
    alt: "Segara Anak crater lake reflecting the Barujari volcano cone and Rinjani caldera walls at golden hour, a highlight of Mount Rinjani tour packages",
  },
  {
    ...heroImg3,
    alt: "Visitor watching a wide waterfall cascade over mossy rocks into an emerald pool on the slopes of Mount Rinjani",
  },
  {
    ...heroImg4,
    alt: "Group of trekkers silhouetted on the Mount Rinjani summit with the morning sun and a sea of clouds stretching to the horizon",
  },
];
