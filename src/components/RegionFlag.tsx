import { regionToFlag } from '#utils/countries';

interface RegionFlagProps {
  region: string | null;
}

export default function RegionFlag({ region }: RegionFlagProps) {
  const flag = regionToFlag(region);
  return flag ? <>{flag}</> : null;
}
