interface RegionFlagProps {
  region: string | null;
}

/** Convert a two-letter region code (e.g. 'kr') into a flag emoji. */
function regionToFlag(region: string | null): string | null {
  if (!region || region.length !== 2) return null;
  const codePoints = region
    .toUpperCase()
    .split('')
    .map((char) => 0x1f1e6 + char.charCodeAt(0) - 65);
  if (codePoints.some((cp) => cp < 0x1f1e6 || cp > 0x1f1ff)) return null;
  return String.fromCodePoint(...codePoints);
}

export default function RegionFlag({ region }: RegionFlagProps) {
  const flag = regionToFlag(region);
  return flag ? <>{flag}</> : null;
}
