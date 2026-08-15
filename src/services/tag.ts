import xior from 'xior';

import type { BaseResponse, PaginatedResponse } from '#types/Response';
import type Tag from '#types/Tag';

export interface TagFormData {
  slug: string;
  name: Record<string, string>;
}

// ── Tags CRUD ──

export async function getTags(
  params: { page?: number; perPage?: number } = {},
): Promise<PaginatedResponse<Tag>> {
  const res = await xior.get<PaginatedResponse<Tag>>('/tags', { params });
  return res.data;
}

export async function getTag(id: number): Promise<Tag> {
  const res = await xior.get<BaseResponse<Tag>>(`/tags/${id}`);
  return res.data.data;
}

export async function createTag(data: TagFormData): Promise<Tag> {
  const res = await xior.post<BaseResponse<Tag>>('/tags', data);
  return res.data.data;
}

export async function updateTag(id: number, data: Partial<TagFormData>): Promise<Tag> {
  const res = await xior.put<BaseResponse<Tag>>(`/tags/${id}`, data);
  return res.data.data;
}

export async function deleteTag(id: number): Promise<void> {
  await xior.delete(`/tags/${id}`);
}

// ── Influencer-Tag relationships ──

export async function getInfluencerTags(influencerId: number): Promise<Tag[]> {
  const res = await xior.get<BaseResponse<Tag[]>>(`/influencers/${influencerId}/tags`);
  return res.data.data;
}

export async function attachTags(influencerId: number, tagIds: number[]): Promise<void> {
  await xior.post(`/influencers/${influencerId}/tags`, { tagIds });
}

export async function detachTag(influencerId: number, tagId: number): Promise<void> {
  await xior.delete(`/influencers/${influencerId}/tags/${tagId}`);
}

// ── Post-Tag relationships ──

export async function getPostTags(postId: number): Promise<Tag[]> {
  const res = await xior.get<BaseResponse<Tag[]>>(`/posts/${postId}/tags`);
  return res.data.data;
}

export async function attachPostTags(postId: number, tagIds: number[]): Promise<void> {
  await xior.post(`/posts/${postId}/tags`, { tagIds });
}

export async function detachPostTag(postId: number, tagId: number): Promise<void> {
  await xior.delete(`/posts/${postId}/tags/${tagId}`);
}
