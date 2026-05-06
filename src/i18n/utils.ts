import { ui, defaultLang, type Lang, type UIKey } from './ui';

export function getLangFromUrl(url: URL): Lang {
  const [, segment] = url.pathname.split('/');
  if (segment === 'en') return 'en';
  return defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t(key: UIKey, vars?: Record<string, string | number>): string {
    const dict = ui[lang] as Record<string, string>;
    const fallback = ui[defaultLang] as Record<string, string>;
    let value = dict[key] ?? fallback[key] ?? key;
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        value = value.replaceAll(`{${k}}`, String(v));
      }
    }
    return value;
  };
}

/** Build a localized path. Always returns a path with leading slash and trailing slash. */
export function localizedPath(lang: Lang, path = ''): string {
  const clean = path.replace(/^\/+|\/+$/g, '');
  if (lang === defaultLang) {
    return clean ? `/${clean}/` : '/';
  }
  return clean ? `/${lang}/${clean}/` : `/${lang}/`;
}

/** Strip locale prefix from a pathname. Returns the path without leading lang segment. */
export function stripLang(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean);
  if (parts[0] === 'en') parts.shift();
  return '/' + parts.join('/') + (pathname.endsWith('/') || parts.length === 0 ? '/' : '');
}

/** Map a route key to a localized URL path. */
export function routeFor(lang: Lang, route: 'home' | 'blog' | 'services'): string {
  if (route === 'home') return localizedPath(lang);
  if (route === 'blog') return localizedPath(lang, 'blog');
  if (route === 'services') {
    return lang === 'nl' ? '/diensten/' : '/en/services/';
  }
  return localizedPath(lang);
}

export function htmlLang(lang: Lang): string {
  return lang === 'nl' ? 'nl-NL' : 'en-US';
}

export function formatDate(date: Date, lang: Lang): string {
  return date.toLocaleDateString(lang === 'nl' ? 'nl-NL' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function readingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

export type { Lang };
