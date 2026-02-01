import apiClient from './api';
import type {
  Comment,
  CreateCommentInput,
  UpdateCommentInput,
  PaginatedResponse,
  PaginationParams,
} from '@/types';

export const commentService = {
  async list(
    personId: string,
    params?: PaginationParams,
  ): Promise<PaginatedResponse<Comment>> {
    const { data } = await apiClient.get<PaginatedResponse<Comment>>(
      `/persons/${personId}/comments`,
      { params },
    );
    return data;
  },

  async create(personId: string, input: CreateCommentInput): Promise<Comment> {
    const { data } = await apiClient.post<Comment>(
      `/persons/${personId}/comments`,
      input,
    );
    return data;
  },

  async update(personId: string, commentId: string, input: UpdateCommentInput): Promise<Comment> {
    const { data } = await apiClient.put<Comment>(
      `/persons/${personId}/comments/${commentId}`,
      input,
    );
    return data;
  },

  async delete(personId: string, commentId: string): Promise<void> {
    await apiClient.delete(`/persons/${personId}/comments/${commentId}`);
  },
};
