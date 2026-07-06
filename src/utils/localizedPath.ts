export function getLocalizedPath(path: string, lang: string): string {
  if (!path) return "#";
  if (
    path.startsWith("http") ||
    path.startsWith("#") ||
    path.startsWith("mailto:") ||
    path.startsWith("tel:")
  ) {
    return path;
  }
  
  // Normalize path (ensure leading slash, remove duplicate slashes, remove trailing slash except for root)
  const cleanPath = "/" + path.split("/").filter(Boolean).join("/");
  
  if (lang === "en") return cleanPath;
  return `/${lang}${cleanPath === "/" ? "" : cleanPath}`;
}
