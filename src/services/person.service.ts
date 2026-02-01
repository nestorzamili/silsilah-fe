import apiClient from './api';
import type {
  Person,
  PersonWithRelationships,
  CreatePersonInput,
  UpdatePersonInput,
  PaginatedResponse,
  PaginationParams,
} from '@/types';

export const personService = {
  async list(params?: PaginationParams): Promise<PaginatedResponse<Person>> {
    const { data } = await apiClient.get<PaginatedResponse<Person>>(
      '/persons',
      {
        params,
      },
    );
    return data;
  },

  async search(query: string, limit = 10): Promise<Person[]> {
    const { data } = await apiClient.get<Person[]>('/persons/search', {
      params: { q: query, limit },
    });
    return data;
  },

  async getById(personId: string): Promise<PersonWithRelationships> {
    const { data } = await apiClient.get<PersonWithRelationships>(
      `/persons/${personId}`,
    );
    return data;
  },

  async create(input: CreatePersonInput): Promise<Person> {
    const { data } = await apiClient.post<Person>('/persons', input);
    return data;
  },

  async update(personId: string, input: UpdatePersonInput): Promise<Person> {
    const { data } = await apiClient.put<Person>(`/persons/${personId}`, input);
    return data;
  },

  async delete(personId: string): Promise<void> {
    await apiClient.delete(`/persons/${personId}`);
  },

  async getPublicPerson(personId: string): Promise<PersonWithRelationships> {
    const { data } = await apiClient.get<PersonWithRelationships>(
      `/public/persons/${personId}`,
    );
    return data;
  },
};
