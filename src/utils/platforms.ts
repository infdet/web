import {
  FacebookLogo,
  GlobeSimple,
  InstagramLogo,
  TiktokLogo,
  XLogo,
  YoutubeLogo,
} from '@phosphor-icons/react';
import type { Icon } from '@phosphor-icons/react';

export const PLATFORM_OPTIONS = [
  { value: 'youtube', label: 'YouTube' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'twitter', label: 'Twitter / X' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'bilibili', label: 'Bilibili' },
  { value: 'weibo', label: 'Weibo' },
  { value: 'douyin', label: 'Douyin' },
  { value: 'xiaohongshu', label: 'Xiaohongshu' },
  { value: 'other', label: 'Other' },
];

export const PLATFORM_ICONS: Record<string, Icon> = {
  youtube: YoutubeLogo,
  instagram: InstagramLogo,
  tiktok: TiktokLogo,
  twitter: XLogo,
  facebook: FacebookLogo,
  bilibili: GlobeSimple,
  weibo: GlobeSimple,
  douyin: GlobeSimple,
  xiaohongshu: GlobeSimple,
  other: GlobeSimple,
};
