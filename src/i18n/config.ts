export const SUPPORTED_LANGS = ["en", "id", "zh", "de", "fr", "es"] as const;
export type Lang = (typeof SUPPORTED_LANGS)[number];
export const DEFAULT_LANG: Lang = "en";

/** BCP 47 tags for hreflang attributes */
export const HREFLANG_MAP: Record<Lang, string> = {
  en: "en",
  id: "id",
  zh: "zh-CN",
  de: "de",
  fr: "fr",
  es: "es",
};

/** Open Graph locale codes */
export const OG_LOCALE_MAP: Record<Lang, string> = {
  en: "en_US",
  id: "id_ID",
  zh: "zh_CN",
  de: "de_DE",
  fr: "fr_FR",
  es: "es_ES",
};
