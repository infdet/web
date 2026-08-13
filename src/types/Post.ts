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
  url: string;
}

export interface PostListMeta {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
  firstPage: number;
  firstPageUrl: string;
  lastPageUrl: string;
  nextPageUrl: string | null;
  previousPageUrl: string | null;
}

export interface PostListResponse {
  data: Post[];
  meta: PostListMeta;
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
