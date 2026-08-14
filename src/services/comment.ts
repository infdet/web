import xior from 'xior';

import type Comment from '#types/Comment';
import type { BaseResponse, PaginatedResponse } from '#types/Response';

export interface CommentListParams {
  page?: number;
  perPage?: number;
}

export async function getComments(
  postId: number,
  params: CommentListParams = {},
): Promise<PaginatedResponse<Comment>> {
  const res = await xior.get<PaginatedResponse<Comment>>(`/posts/${postId}/comments`, { params });
  return res.data;
}

export async function createComment(postId: number, body: string): Promise<Comment> {
  const res = await xior.post<BaseResponse<Comment>>(`/posts/${postId}/comments`, { body });
  return res.data.data;
}

export async function updateComment(
  postId: number,
  commentId: number,
  body: string,
): Promise<Comment> {
  const res = await xior.put<BaseResponse<Comment>>(`/posts/${postId}/comments/${commentId}`, {
    body,
  });
  return res.data.data;
}

export async function deleteComment(postId: number, commentId: number): Promise<void> {
  await xior.delete(`/posts/${postId}/comments/${commentId}`);
}
