export const SITE = {
  name: "Go2Rinjani",
  url: "https://go2rinjani.com",
  logoPath: "/assets/logo.svg",
  /** Default OG for non-blog pages (1200×630) */
  defaultOgImagePath: "/og/og-default.jpg",
  phone: "+6281916030378",
  address: {
    streetAddress:
      "Jl. Pariwisata Senaru, Dusun, Tumpang Sari, Kec. Bayan",
    city: "Mataram",
    region: "Nusa Tenggara Barat",
    postalCode: "83354",
    country: "ID",
  },
  geo: {
    lat: -8.285074,
    lng: 116.414391,
  },
  sameAs: [
    "https://wa.me/6281916030378",
    "https://instagram.com/go2rinjaniofficial",
    "https://facebook.com/Go2Rinjani",
  ],
} as const;
