import api from './api';
import type { Notification, PaginatedResponse } from '@/types';

export const notificationService = {
  list: async (params?: { page?: number; page_size?: number; unread_only?: boolean }) => {
    const { data } = await api.get<PaginatedResponse<Notification>>('/notifications', { params });
    return data;
  },

  getUnreadCount: async () => {
    const { data } = await api.get<{ count: number }>('/notifications/unread-count');
    return data.count;
  },

  markAsRead: async (id: string) => {
    await api.patch(`/notifications/${id}/read`);
  },

  markAllAsRead: async () => {
    await api.post('/notifications/mark-all-read');
  },
};
