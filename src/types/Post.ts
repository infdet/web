import type BaseModel from './BaseModel';
import type Tag from './Tag';

export type PostPlatform =
  | 'youtube'
  | 'instagram'
  | 'bilibili'
  | 'tiktok'
  | 'twitter'
  | 'douyin'
  | 'facebook'
  | 'weibo'
  | 'xiaohongshu';

export type PostType = 'photo' | 'video';

export default interface Post extends BaseModel {
  platform: PostPlatform;
  type: PostType;
  externalUrl: string;
  externalId: string;
  publishedAt: string | null;
  embedUrl: string | null;
  deletedAt: string | null;
  tags: Tag[];
}

export interface PostFormData {
  platform: PostPlatform;
  type: PostType;
  externalUrl: string;
  externalId: string;
  publishedAt?: string | null;
}
