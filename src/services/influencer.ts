import xior from 'xior';

import type Influencer from '#types/Influencer';
import type { BaseResponse, PaginatedResponse } from '#types/Response';

export interface InfluencerListParams {
  page?: number;
  perPage?: number;
}

export interface InfluencerFormData {
  slug: string;
  name: Record<string, string>;
}

export async function getInfluencers(
  params: InfluencerListParams = {},
): Promise<PaginatedResponse<Influencer>> {
  const res = await xior.get<PaginatedResponse<Influencer>>('/influencers', { params });
  return res.data;
}

export async function getInfluencer(id: number): Promise<Influencer> {
  const res = await xior.get<BaseResponse<Influencer>>(`/influencers/${id}`);
  return res.data.data;
}

export async function createInfluencer(data: InfluencerFormData): Promise<Influencer> {
  const res = await xior.post<BaseResponse<Influencer>>('/influencers', data);
  return res.data.data;
}

export async function updateInfluencer(
  id: number,
  data: Partial<InfluencerFormData>,
): Promise<Influencer> {
  const res = await xior.put<BaseResponse<Influencer>>(`/influencers/${id}`, data);
  return res.data.data;
}

export async function deleteInfluencer(id: number): Promise<void> {
  await xior.delete(`/influencers/${id}`);
}

export async function uploadAvatar(id: number, file: File): Promise<Influencer> {
  const formData = new FormData();
  formData.append('avatar', file);
  const res = await xior.post<BaseResponse<Influencer>>(`/influencers/${id}/avatar`, formData);
  return res.data.data;
}

export async function uploadCover(id: number, file: File): Promise<Influencer> {
  const formData = new FormData();
  formData.append('cover', file);
  const res = await xior.post<BaseResponse<Influencer>>(`/influencers/${id}/cover`, formData);
  return res.data.data;
}
