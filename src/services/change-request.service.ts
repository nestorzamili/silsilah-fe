import apiClient from './api';
import type {
  ChangeRequest,
  CreateChangeRequestInput,
  ReviewChangeRequestInput,
  RequestStatus,
  PaginatedResponse,
  PaginationParams,
} from '@/types';

export const changeRequestService = {
  async list(
    params?: PaginationParams & { status?: RequestStatus },
  ): Promise<PaginatedResponse<ChangeRequest>> {
    const { data } = await apiClient.get<PaginatedResponse<ChangeRequest>>(
      '/change-requests',
      { params },
    );
    return data;
  },

  async getById(requestId: string): Promise<ChangeRequest> {
    const { data } = await apiClient.get<ChangeRequest>(
      `/change-requests/${requestId}`,
    );
    return data;
  },

  async create(input: CreateChangeRequestInput): Promise<ChangeRequest> {
    const { data } = await apiClient.post<ChangeRequest>(
      '/change-requests',
      input,
    );
    return data;
  },

  async approve(
    requestId: string,
    input?: ReviewChangeRequestInput,
  ): Promise<void> {
    await apiClient.post(`/change-requests/${requestId}/approve`, input);
  },

  async reject(
    requestId: string,
    input?: ReviewChangeRequestInput,
  ): Promise<void> {
    await apiClient.post(`/change-requests/${requestId}/reject`, input);
  },
};
