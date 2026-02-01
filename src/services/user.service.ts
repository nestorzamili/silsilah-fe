import apiClient from './api';
import type {
  User,
  Person,
  UpdateUserInput,
  AssignRoleInput,
  RoleUsers,
} from '@/types';

export const userService = {
  async getProfile(): Promise<User> {
    const { data } = await apiClient.get<User>('/users/me');
    return data;
  },

  async getAncestors(): Promise<Person[]> {
    const { data } = await apiClient.get<Person[]>('/users/me/ancestors');
    return data;
  },

  async updateProfile(input: UpdateUserInput): Promise<User> {
    const { data } = await apiClient.put<User>('/users/me', input);
    return data;
  },

  async assignRole(input: AssignRoleInput): Promise<void> {
    await apiClient.post<void>('/users/assign-role', input);
  },

  async listByRole(role: string): Promise<User[]> {
    const { data } = await apiClient.get<User[]>(`/users/by-role/${role}`);
    return data;
  },

  async getRoleUsers(): Promise<RoleUsers> {
    const { data } = await apiClient.get<RoleUsers>('/users/role-users');
    return data;
  },

  async getAllUsers(): Promise<User[]> {
    const { data } = await apiClient.get<User[]>('/users');
    return data;
  },

  async deleteUser(userId: string): Promise<void> {
    await apiClient.delete<void>(`/users/${userId}`);
  },
};