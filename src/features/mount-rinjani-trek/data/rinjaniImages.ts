import coverImage from "../../../assets/images/tours/mount-rinjani-trek/mount-rinjani-trek-detail/mount-rinjani-trek.avif";

import sembalun1 from "../../../assets/images/tours/mount-rinjani-trek/mount-rinjani-trek-detail/sembalun-route/sembalun-route.avif";
import sembalun2 from "../../../assets/images/tours/mount-rinjani-trek/mount-rinjani-trek-detail/sembalun-route/sembalun-route-2.avif";
import senaru1 from "../../../assets/images/tours/mount-rinjani-trek/mount-rinjani-trek-detail/senaru-route/senaru-route.avif";
import senaru2 from "../../../assets/images/tours/mount-rinjani-trek/mount-rinjani-trek-detail/senaru-route/senaru-route-2.avif";

export const rinjaniHeroImage = {
  ...coverImage,
  alt: "Sunrise behind the silhouetted Rinjani crater rim with a thick sea of clouds filling the caldera, a breathtaking sight on a Mount Rinjani trek",
};

export const rinjaniRouteImages: Record<string, any[]> = {
  "sembalun-route": [
    { ...sembalun1, alt: "Aerial view of colorful camping tents on the green Sembalun crater rim with Segara Anak lake and Rinjani's rocky peaks behind" },
    { ...sembalun2, alt: "Panoramic drone shot of the Mount Rinjani trek showing the full crater rim, summit cone, and campsite nestled on the ridge at dusk" },
  ],
  "senaru-route": [
    { ...senaru1, alt: "Yellow camping tents perched on the Senaru crater rim overlooking the turquoise Segara Anak lake and steaming volcanic cliffs" },
    { ...senaru2, alt: "Trekkers descending a grassy slope through scattered pine trees toward Segara Anak lake on the Senaru route of the Mount Rinjani trek" },
  ],
};
