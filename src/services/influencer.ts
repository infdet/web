import xior from 'xior';

import type Influencer from '#types/Influencer';
import type { InfluencerDetailResponse, InfluencerListResponse } from '#types/Influencer';

export interface InfluencerListParams {
  page?: number;
  perPage?: number;
}

export interface InfluencerFormData {
  slug: string;
  name: Record<string, string>;
  accounts: { platform: string; username: string }[];
}

export async function getInfluencers(
  params: InfluencerListParams = {},
): Promise<InfluencerListResponse> {
  const res = await xior.get<InfluencerListResponse>('/influencers', { params });
  return res.data;
}

export async function getInfluencer(id: number): Promise<Influencer> {
  const res = await xior.get<InfluencerDetailResponse>(`/influencers/${id}`);
  return res.data.data;
}

export async function createInfluencer(data: InfluencerFormData): Promise<Influencer> {
  const res = await xior.post<InfluencerDetailResponse>('/influencers', data);
  return res.data.data;
}

export async function updateInfluencer(
  id: number,
  data: Partial<InfluencerFormData>,
): Promise<Influencer> {
  const res = await xior.put<InfluencerDetailResponse>(`/influencers/${id}`, data);
  return res.data.data;
}

export async function deleteInfluencer(id: number): Promise<void> {
  await xior.delete(`/influencers/${id}`);
}

export async function uploadAvatar(id: number, file: File): Promise<Influencer> {
  const formData = new FormData();
  formData.append('avatar', file);
  const res = await xior.post<InfluencerDetailResponse>(`/influencers/${id}/avatar`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.data;
}

export async function uploadCover(id: number, file: File): Promise<Influencer> {
  const formData = new FormData();
  formData.append('cover', file);
  const res = await xior.post<InfluencerDetailResponse>(`/influencers/${id}/cover`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.data;
}
