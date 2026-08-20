import i18n from '../config/i18n';

/**
 * Resolve a multilingual name map to a single display string. Prefers the translation matching the
 * current UI language, then falls back to English, Chinese, the first available locale, and finally
 * the fallback.
 */
export function getLocalizedName(name: Record<string, string>, fallback = ''): string {
  const lang = (i18n.language || 'en').split('-')[0];
  return name[lang] || name.en || name.zh || Object.values(name)[0] || fallback;
}
