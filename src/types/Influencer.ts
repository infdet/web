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

export interface InfluencerDetailResponse {
  data: Influencer;
}
