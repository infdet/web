import xior from 'xior';

import type Influencer from '#types/Influencer';
import type Post from '#types/Post';
import type { PostFormData } from '#types/Post';
import type { BaseResponse, PaginatedResponse } from '#types/Response';

// ── Posts CRUD ──

export async function getPosts(
  params: { page?: number; perPage?: number } = {},
): Promise<PaginatedResponse<Post>> {
  const res = await xior.get<PaginatedResponse<Post>>('/posts', { params });
  return res.data;
}

export async function getPost(id: number): Promise<Post> {
  const res = await xior.get<BaseResponse<Post>>(`/posts/${id}`);
  return res.data.data;
}

export async function getPostInfluencers(postId: number): Promise<Influencer[]> {
  const res = await xior.get<BaseResponse<Influencer[]>>(`/posts/${postId}/influencers`);
  return res.data.data;
}

export async function createPost(data: PostFormData): Promise<Post> {
  const res = await xior.post<BaseResponse<Post>>('/posts', data);
  return res.data.data;
}

export async function updatePost(id: number, data: Partial<PostFormData>): Promise<Post> {
  const res = await xior.put<BaseResponse<Post>>(`/posts/${id}`, data);
  return res.data.data;
}

export async function deletePost(id: number): Promise<void> {
  await xior.delete(`/posts/${id}`);
}

// ── Influencer-Post relationships ──

export async function getInfluencerPosts(
  influencerId: number,
  params: { page?: number; perPage?: number } = {},
): Promise<PaginatedResponse<Post>> {
  const res = await xior.get<PaginatedResponse<Post>>(`/influencers/${influencerId}/posts`, {
    params,
  });
  return res.data;
}

export async function attachPosts(influencerId: number, postId: number): Promise<void> {
  await xior.post(`/influencers/${influencerId}/posts`, { postId });
}

export async function detachPost(influencerId: number, postId: number): Promise<void> {
  await xior.delete(`/influencers/${influencerId}/posts/${postId}`);
}

export async function attachInfluencers(postId: number, influencerId: number): Promise<void> {
  await xior.post(`/posts/${postId}/influencers`, { influencerId });
}

export async function detachInfluencer(postId: number, influencerId: number): Promise<void> {
  await xior.delete(`/posts/${postId}/influencers/${influencerId}`);
}

// ── Auto-infer ──

export interface InferInfluencersResult {
  attached: number[];
}

export async function inferPostInfluencers(postId: number): Promise<InferInfluencersResult> {
  const res = await xior.post<InferInfluencersResult>(`/posts/${postId}/infer-influencers`);
  return res.data;
}
