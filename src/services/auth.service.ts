import apiClient from './api';
import type {
  User,
  LoginInput,
  RegisterInput,
  UpdateUserInput,
  AuthResponse,
  RegisterResponse,
  TokenResponse
} from '@/types';

export const authService = {
  async login(input: LoginInput): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', input);
    return data;
  },

  async register(input: RegisterInput): Promise<RegisterResponse> {
    const { data } = await apiClient.post<RegisterResponse>(
      '/auth/register',
      input,
    );
    return data;
  },

  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    const { data } = await apiClient.post<TokenResponse>('/auth/refresh', {
      refresh_token: refreshToken,
    });
    return data;
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const { data } = await apiClient.post<{ message: string }>(
      '/auth/forgot-password',
      {
        email,
      },
    );
    return data;
  },

  async resetPassword(
    token: string,
    password: string,
  ): Promise<{ message: string }> {
    const { data } = await apiClient.post<{ message: string }>(
      '/auth/reset-password',
      {
        token,
        password,
      },
    );
    return data;
  },

  async getProfile(): Promise<User> {
    const { data } = await apiClient.get<User>('/users/me');
    return data;
  },

  async updateProfile(input: UpdateUserInput): Promise<User> {
    const { data } = await apiClient.put<User>('/users/me', input);
    return data;
  },

  async verifyEmail(token: string): Promise<{ message: string }> {
    const { data } = await apiClient.get<{ message: string }>(
      `/auth/verify-email?token=${token}`
    );
    return data;
  },

  async resendVerificationEmail(email: string): Promise<{ message: string }> {
    const { data } = await apiClient.post<{ message: string }>(
      '/auth/resend-verification',
      { email }
    );
    return data;
  },
};
