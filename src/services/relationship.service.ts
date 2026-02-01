import apiClient from './api';
import type {
  Relationship,
  CreateRelationshipInput,
  UpdateRelationshipInput,
  RelationshipType,
} from '@/types';

export const relationshipService = {
  async list(params?: {
    type?: RelationshipType;
    person_id?: string;
  }): Promise<Relationship[]> {
    const { data } = await apiClient.get<Relationship[]>('/relationships', {
      params,
    });
    return data;
  },

  async getById(relationshipId: string): Promise<Relationship> {
    const { data } = await apiClient.get<Relationship>(
      `/relationships/${relationshipId}`,
    );
    return data;
  },

  async create(input: CreateRelationshipInput): Promise<Relationship> {
    const { data } = await apiClient.post<Relationship>(
      '/relationships',
      input,
    );
    return data;
  },

  async update(
    relationshipId: string,
    input: UpdateRelationshipInput,
  ): Promise<Relationship> {
    const { data } = await apiClient.put<Relationship>(
      `/relationships/${relationshipId}`,
      input,
    );
    return data;
  },

  async delete(relationshipId: string): Promise<void> {
    await apiClient.delete(`/relationships/${relationshipId}`);
  },
};
