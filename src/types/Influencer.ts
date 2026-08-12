import type BaseModel from './BaseModel';

export interface Account {
  id: number;
  platform: string;
  username: string;
}

export default interface Influencer extends BaseModel {
  slug: string;
  name: Record<string, string>;
  avatar: string | null;
  cover: string | null;
  accounts: Account[];
}

export interface InfluencerListMeta {
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

export interface InfluencerListResponse {
  data: Influencer[];
  meta: InfluencerListMeta;
}

export interface InfluencerDetailResponse {
  data: Influencer;
}
