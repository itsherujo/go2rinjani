import {
  DEFAULT_LANG,
  HREFLANG_MAP,
  SUPPORTED_LANGS,
  type Lang,
} from "../i18n/config";

export function getSiteUrl(site: URL | string | undefined): string {
  if (!site) return "https://go2rinjani.com";
  return site.toString().replace(/\/$/, "");
}

/** Path without locale prefix (e.g. `/id/tours` → `/tours`) */
export function getPathWithoutLang(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];

  if (
    first &&
    SUPPORTED_LANGS.includes(first as Lang) &&
    first !== DEFAULT_LANG
  ) {
    const rest = segments.slice(1);
    return rest.length ? `/${rest.join("/")}` : "/";
  }

  return pathname || "/";
}

export function getLocalizedPath(pathWithoutLang: string, lang: Lang): string {
  const normalized = pathWithoutLang === "/" ? "" : pathWithoutLang;
  if (lang === DEFAULT_LANG) return normalized || "/";
  return `/${lang}${normalized}`;
}

export function getCanonicalUrl(
  site: URL | string | undefined,
  pathname: string,
  lang?: Lang,
): string {
  const siteUrl = getSiteUrl(site);
  
  // Detect if pathname has a supported lang prefix already
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];
  let detectedLang: Lang | undefined;
  if (first && SUPPORTED_LANGS.includes(first as Lang)) {
    detectedLang = first as Lang;
  }

  const targetLang = lang || detectedLang;
  const pathWithoutLang = getPathWithoutLang(pathname);

  // Ensure trailing slash for non-root paths
  const cleanSegments = pathWithoutLang.split("/").filter(Boolean);
  let normalizedPath = "/" + cleanSegments.join("/");
  if (normalizedPath !== "/") {
    normalizedPath += "/";
  }

  if (targetLang && targetLang !== DEFAULT_LANG) {
    return `${siteUrl}/${targetLang}${normalizedPath === "/" ? "/" : normalizedPath}`;
  }
  
  return `${siteUrl}${normalizedPath}`;
}

export function getAlternateUrls(
  site: URL | string | undefined,
  pathname: string,
): { hreflang: string; href: string }[] {
  const siteUrl = getSiteUrl(site);
  const basePath = getPathWithoutLang(pathname);

  return SUPPORTED_LANGS.map((lang) => ({
    hreflang: HREFLANG_MAP[lang],
    href: `${siteUrl}${getLocalizedPath(basePath, lang)}`,
  }));
}

export function toAbsoluteUrl(
  site: URL | string | undefined,
  pathOrUrl: string,
): string {
  if (pathOrUrl.startsWith("http")) return pathOrUrl;
  const siteUrl = getSiteUrl(site);
  return `${siteUrl}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`;
}

/** Parse blog frontmatter dates like "23 May 2026" to ISO 8601 */
export function parseBlogDate(dateStr: string): string {
  const parsed = Date.parse(dateStr);
  if (!Number.isNaN(parsed)) {
    return new Date(parsed).toISOString().split("T")[0]!;
  }
  return new Date().toISOString().split("T")[0]!;
}
