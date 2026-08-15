import { GlobeSimple } from '@phosphor-icons/react';

import { PLATFORM_ICONS } from '#utils/platforms';

interface PlatformIconProps {
  platform: string;
  size?: number;
}

export default function PlatformIcon({ platform, size = 16 }: PlatformIconProps) {
  const Icon = PLATFORM_ICONS[platform] ?? GlobeSimple;
  return <Icon size={size} />;
}
