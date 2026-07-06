
const supportedLngs = ["en", "id", "zh", "de", "fr", "es"];
const defaultLng = "en";

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (supportedLngs.includes(lang)) return lang;
  return defaultLng;
}

export function useTranslations(lang: string, namespace: string = "common") {
  return function t(key: string, options?: any) {
    let dict = getDictionary(lang, namespace);
    
    // Fallback to english if key not found
    if (!keyExists(dict, key)) {
      dict = getDictionary(defaultLng, namespace);
    }
    
    let result = resolveKey(dict, key);
    if (result === undefined) {
      return options?.defaultValue !== undefined ? options.defaultValue : key;
    }

    // Handle returnObjects
    if (options?.returnObjects && typeof result === 'object') {
      return result;
    }

    if (typeof result !== 'string') return key;

    // Very basic interpolation {{ var }}
    if (options) {
      for (const [k, v] of Object.entries(options)) {
        if (typeof v === 'string' || typeof v === 'number') {
          result = result.replace(new RegExp(`{{${k}}}`, 'g'), String(v));
        }
      }
    }

    return result;
  }
}

// Simple cache to avoid re-reading files on every call during dev
const dictionaryCache: Record<string, any> = {};

// Use Vite's import.meta.glob instead of node:fs/path to avoid Astro typing errors
const localesGlob = import.meta.glob('/public/locales/**/*.json', { eager: true });

export function getDictionary(lang: string, namespace: string) {
  const cacheKey = `${lang}_${namespace}`;
  if (dictionaryCache[cacheKey]) return dictionaryCache[cacheKey];

  try {
    const key = `/public/locales/${lang}/${namespace}.json`;
    const dictObj = localesGlob[key];
    
    if (!dictObj) {
      console.warn(`Translation file not found: ${lang}/${namespace}.json`);
      return {};
    }
    
    const dict = (dictObj as any).default || dictObj;
    dictionaryCache[cacheKey] = dict;
    return dict;
  } catch (e) {
    console.warn(`Translation file not found: ${lang}/${namespace}.json`);
    return {};
  }
}

function resolveKey(obj: any, path: string) {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

function keyExists(obj: any, path: string) {
  return resolveKey(obj, path) !== undefined;
}

export { getLocalizedPath } from "../utils/localizedPath";

