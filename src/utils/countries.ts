/** ISO 3166-1 alpha-2 country codes (lowercase) available for selection. */
export const COUNTRY_CODES = [
  'kr',
  'jp',
  'cn',
  'tw',
  'hk',
  'mo',
  'sg',
  'th',
  'vn',
  'ph',
  'my',
  'id',
  'us',
  'ca',
  'gb',
  'fr',
  'de',
  'it',
  'es',
  'pt',
  'nl',
  'be',
  'ch',
  'at',
  'se',
  'no',
  'dk',
  'fi',
  'pl',
  'cz',
  'ru',
  'ua',
  'tr',
  'gr',
  'br',
  'mx',
  'ar',
  'cl',
  'co',
  'pe',
  'au',
  'nz',
  'in',
  'il',
  'ae',
  'sa',
  'za',
  'eg',
] as const;

/** Convert a two-letter region code (e.g. 'kr') into a flag emoji. */
export function regionToFlag(region: string | null): string | null {
  if (!region || region.length !== 2) return null;
  const codePoints = region
    .toUpperCase()
    .split('')
    .map((char) => 0x1f1e6 + char.charCodeAt(0) - 65);
  if (codePoints.some((cp) => cp < 0x1f1e6 || cp > 0x1f1ff)) return null;
  return String.fromCodePoint(...codePoints);
}
