import i18n from '../i18n';

/**
 * Resolve a multilingual tag name to a single display string. Prefers the translation matching the
 * current UI language, then falls back to English, Chinese, the first available locale, and finally
 * the fallback.
 */
export function getTagName(name: Record<string, string>, fallback = ''): string {
  const lang = (i18n.language || 'en').split('-')[0];
  return name[lang] || name.en || name.zh || Object.values(name)[0] || fallback;
}
