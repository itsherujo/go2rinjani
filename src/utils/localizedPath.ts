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
  
  // Normalize path (ensure leading slash, remove duplicate slashes, ensure trailing slash if not root)
  const segments = path.split("/").filter(Boolean);
  let cleanPath = "/" + segments.join("/");
  if (cleanPath !== "/") {
    cleanPath += "/";
  }
  
  if (lang === "en") return cleanPath;
  return `/${lang}${cleanPath === "/" ? "/" : cleanPath}`;
}
