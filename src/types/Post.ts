import type BaseModel from './BaseModel';

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
  embedUrl: string | null;
}

export interface PostDetailResponse {
  data: Post;
}

export interface PostFormData {
  platform: PostPlatform;
  type: PostType;
  externalUrl: string;
  externalId: string;
}
