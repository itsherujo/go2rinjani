import heroImg from "../../../assets/images/about/certified-local-rinjani-guides.avif";
import summitAchievementImg from "../../../assets/images/about/mount-rinjani-summit-achievement.avif";
import localExperienceImg from "../../../assets/images/about/rinjani-trekking-local-experience.avif";
import coupleExperienceImg from "../../../assets/images/about/couple-rinjani-trekking-experience.avif";
import familyAdventureImg from "../../../assets/images/about/family-rinjani-trekking-adventure.avif";
import globalCommunityImg from "../../../assets/images/about/global-trekking-community-rinjani.avif";
import sasakCommunityImg from "../../../assets/images/about/sasak-community-trekking-lombok.avif";
import toreanRouteImg from "../../../assets/images/about/torean-route-rinjani-trekking.avif";
import summit3726mImg from "../../../assets/images/about/summit-mount-rinjani-3726m.avif";
import campingSunriseImg from "../../../assets/images/about/rinjani-camping-sunrise-view.avif";

import type { ImageMetadata } from 'astro';

export interface AboutImage {
  src: ImageMetadata;
  alt: string;
}

export const aboutImages = {
  hero: {
    src: heroImg,
    alt: "Four local guides and hikers posing together on the crater rim overlooking the turquoise Segara Anak lake on a trek organized by go2rinjani",
  } as AboutImage,
  closing: {
    src: campingSunriseImg,
    alt: "Two trekkers standing by their campsite tents at sunrise overlooking the clouds on a go2rinjani trek",
  } as AboutImage,
  sections: {
    hub: [
      {
        src: summitAchievementImg,
        alt: "A group of happy trekkers posing with the Rinjani 3,726m summit sign during a guided climb with go2rinjani",
      },
      {
        src: localExperienceImg,
        alt: "A couple taking a friendly selfie with their local guide at a trail checkpoint during a go2rinjani trek",
      },
    ] as AboutImage[],
    reimagined: [
      {
        src: coupleExperienceImg,
        alt: "A couple and their go2rinjani guide posing on the Rinjani crater rim with Segara Anak lake behind them",
      },
      {
        src: familyAdventureImg,
        alt: "A family of four posing on the volcanic slope near the summit of Mount Rinjani during a trek guided by go2rinjani",
      },
    ] as AboutImage[],
    community: [
      {
        src: globalCommunityImg,
        alt: "A group of international trekkers and local guides posing together at a Rinjani campsite with go2rinjani",
      },
      {
        src: sasakCommunityImg,
        alt: "Local Sasak guides and porters resting on the trail overlooking Segara Anak lake during a go2rinjani expedition",
      },
    ] as AboutImage[],
    discovery: [
      {
        src: toreanRouteImg,
        alt: "Two trekkers taking a break in the scenic Torean valley riverbed during a go2rinjani trek",
      },
      {
        src: summit3726mImg,
        alt: "Trekkers proudly holding the go2rinjani flag at the summit of Mount Rinjani, 3,726 meters above sea level",
      },
    ] as AboutImage[],
  },
};
