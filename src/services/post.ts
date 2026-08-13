import xior from 'xior';

import type { PaginatedResponse } from '#types/Pagination';
import type Post from '#types/Post';
import type { PostDetailResponse, PostFormData } from '#types/Post';

// ── Posts CRUD ──

export async function getPosts(
  params: { page?: number; perPage?: number } = {},
): Promise<PaginatedResponse<Post>> {
  const res = await xior.get<PaginatedResponse<Post>>('/posts', { params });
  return res.data;
}

export async function getPost(id: number): Promise<Post> {
  const res = await xior.get<PostDetailResponse>(`/posts/${id}`);
  return res.data.data;
}

export async function createPost(data: PostFormData): Promise<Post> {
  const res = await xior.post<PostDetailResponse>('/posts', data);
  return res.data.data;
}

export async function updatePost(id: number, data: Partial<PostFormData>): Promise<Post> {
  const res = await xior.put<PostDetailResponse>(`/posts/${id}`, data);
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

export async function attachPosts(influencerId: number, postIds: number[]): Promise<void> {
  await xior.post(`/influencers/${influencerId}/posts`, { postIds });
}

export async function detachPost(influencerId: number, postId: number): Promise<void> {
  await xior.delete(`/influencers/${influencerId}/posts/${postId}`);
}
