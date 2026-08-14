import type { PostPlatform, PostType } from '#types/Post';

export interface ParsedPostUrl {
  platform: PostPlatform;
  type: PostType;
  externalId: string;
  externalUrl: string;
  embedUrl: string | null;
}

const EMBED_URLS: Partial<Record<PostPlatform, (id: string) => string>> = {
  youtube: (id) => `https://www.youtube.com/embed/${id}`,
  bilibili: (id) => `https://player.bilibili.com/player.html?bvid=${id}&autoplay=0`,
  tiktok: (id) => `https://www.tiktok.com/embed/v2/${id}`,
  instagram: (id) => `https://www.instagram.com/p/${id}/embed/`,
};

function hostnameOf(urlObj: URL): string {
  return urlObj.hostname.replace(/^www\./, '');
}

function segment(pathname: string, index: number): string {
  return pathname.split('/')[index] ?? '';
}

/**
 * Parse a third-party post URL (YouTube / Instagram / TikTok / Bilibili) into the post fields
 * expected by the API. Returns null for unsupported or invalid links. Mirrors the URL patterns used
 * by the browser extension's parseUrl.
 */
export default function parsePostUrl(url?: string): ParsedPostUrl | null {
  if (!url) return null;

  let urlObj: URL;
  try {
    urlObj = new URL(url);
  } catch {
    return null;
  }

  const hostname = hostnameOf(urlObj);
  const pathname = urlObj.pathname;

  // YouTube: /watch?v=..., /shorts/..., and youtu.be short links.
  if (hostname === 'youtube.com' || hostname === 'm.youtube.com') {
    let externalId = '';
    if (pathname.startsWith('/shorts/')) {
      externalId = segment(pathname, 2);
    } else if (pathname === '/watch') {
      externalId = urlObj.searchParams.get('v') ?? '';
    }
    if (!externalId) return null;
    return {
      platform: 'youtube',
      type: 'video',
      externalId,
      externalUrl: urlObj.toString(),
      embedUrl: EMBED_URLS.youtube?.(externalId) ?? null,
    };
  }

  if (hostname === 'youtu.be') {
    const externalId = segment(pathname, 1);
    if (!externalId) return null;
    return {
      platform: 'youtube',
      type: 'video',
      externalId,
      externalUrl: urlObj.toString(),
      embedUrl: EMBED_URLS.youtube?.(externalId) ?? null,
    };
  }

  // Instagram: /p/{id} (post) and /reel/{id} or /reels/{id} (video).
  if (hostname === 'instagram.com') {
    if (pathname.startsWith('/p/')) {
      const externalId = segment(pathname, 2);
      if (!externalId) return null;
      return {
        platform: 'instagram',
        type: 'photo',
        externalId,
        externalUrl: urlObj.toString(),
        embedUrl: EMBED_URLS.instagram?.(externalId) ?? null,
      };
    }
    if (pathname.startsWith('/reel/') || pathname.startsWith('/reels/')) {
      const externalId = segment(pathname, 2);
      if (!externalId) return null;
      return {
        platform: 'instagram',
        type: 'video',
        externalId,
        externalUrl: urlObj.toString(),
        embedUrl: null,
      };
    }
    return null;
  }

  // TikTok: /@username/video/{id}.
  if (hostname === 'tiktok.com') {
    if (pathname.startsWith('/@') && segment(pathname, 2) === 'video') {
      const externalId = segment(pathname, 3);
      if (!externalId) return null;
      return {
        platform: 'tiktok',
        type: 'video',
        externalId,
        externalUrl: urlObj.toString(),
        embedUrl: EMBED_URLS.tiktok?.(externalId) ?? null,
      };
    }
    return null;
  }

  // Bilibili: /video/{BVid}.
  if (hostname === 'bilibili.com' || hostname === 'm.bilibili.com') {
    if (pathname.startsWith('/video/')) {
      const externalId = segment(pathname, 2);
      if (!externalId) return null;
      return {
        platform: 'bilibili',
        type: 'video',
        externalId,
        externalUrl: urlObj.toString(),
        embedUrl: EMBED_URLS.bilibili?.(externalId) ?? null,
      };
    }
    return null;
  }

  return null;
}
