import api from './api';

export interface AuditLog {
  id: string;
  user_id: string;
  user_name?: string;
  action: string;
  entity_type: string;
  entity_id: string;
  old_value?: unknown;
  new_value?: unknown;
  created_at: string;
}

export const auditService = {
  getRecentActivities: async (limit: number = 10): Promise<AuditLog[]> => {
    const response = await api.get<AuditLog[]>(`/audit/recent?limit=${limit}`);
    return response.data;
  },
};
