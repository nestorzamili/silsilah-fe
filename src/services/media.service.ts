import apiClient from './api';
import type { Media, PaginatedResponse, PaginationParams } from '@/types';

export const mediaService = {
  async list(
    params?: PaginationParams & { person_id?: string },
  ): Promise<PaginatedResponse<Media>> {
    const { data } = await apiClient.get<PaginatedResponse<Media>>('/media', {
      params,
    });
    return data;
  },

  async getById(mediaId: string): Promise<Media> {
    const { data } = await apiClient.get<Media>(`/media/${mediaId}`);
    return data;
  },

  async upload(
    file: File,
    personId?: string,
    caption?: string,
  ): Promise<Media> {
    const formData = new FormData();
    formData.append('file', file);
    if (personId) formData.append('person_id', personId);
    if (caption) formData.append('caption', caption);

    const { data } = await apiClient.post<Media>('/media', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  async delete(mediaId: string, requesterNote?: string): Promise<void | { message: string; change_request: unknown }> {
    const params = requesterNote ? { requester_note: requesterNote } : {};
    const { data } = await apiClient.delete(`/media/${mediaId}`, { params });
    return data;
  },
};
