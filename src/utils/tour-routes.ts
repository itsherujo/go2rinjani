import {
  DEFAULT_LANG,
  SUPPORTED_LANGS,
  type Lang,
} from "../i18n/config";

/** Preferred public URL for a tour package (matches canonical). */
export function getTourCanonicalPath(slug: string): string {
  if (slug.includes("stampol")) {
    return `/tours/${slug}`;
  }
  return `/tours/mount-rinjani-trek/${slug}`;
}

/**
 * If `pathname` is a legacy tour alias, returns the canonical path to redirect to.
 * Otherwise returns null (no redirect).
 */
export function getTourRedirectTarget(pathname: string): string | null {
  const path = pathname.replace(/\/$/, "") || "/";
  const segments = path.split("/").filter(Boolean);

  let langPrefix = "";
  let rest = segments;

  const first = segments[0];
  if (
    first &&
    SUPPORTED_LANGS.includes(first as Lang) &&
    first !== DEFAULT_LANG
  ) {
    langPrefix = `/${first}`;
    rest = segments.slice(1);
  }

  if (rest[0] !== "tours" || rest.length < 2) {
    return null;
  }

  // /tours/mount-rinjani/{package-slug} → canonical trek path
  if (rest[1] === "mount-rinjani" && rest.length === 3) {
    return `${langPrefix}/tours/mount-rinjani-trek/${rest[2]}`;
  }

  // /tours/{package-slug} (bare slug, not hub pages)
  if (rest.length === 2) {
    const segment = rest[1]!;
    if (segment === "mount-rinjani-trek" || segment === "mount-stampol-trek") {
      return null;
    }
    if (segment.includes("stampol")) {
      return `${langPrefix}/tours/mount-stampol-trek`;
    }
    return `${langPrefix}/tours/mount-rinjani-trek/${segment}`;
  }

  return null;
}

/** True when this URL should not appear in the sitemap (legacy alias). */
export function isTourAliasPath(pathname: string): boolean {
  return getTourRedirectTarget(pathname) !== null;
}
